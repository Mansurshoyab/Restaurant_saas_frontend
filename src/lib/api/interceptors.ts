import axios from 'axios';
import { apiClient, normalizeApiError } from './client';
import { useAuthStore } from '@/lib/stores/authStore';
import { config } from '@/lib/config';

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function subscribeTokenRefresh(callback: (token: string) => void) {
  refreshSubscribers.push(callback);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
}

export function registerInterceptors() {
  // Attach the current access token to every request.
  apiClient.interceptors.request.use((requestConfig) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
    }
    return requestConfig;
  });

  // On 401, attempt exactly one silent refresh-and-retry per failing
  // request. Concurrent 401s (several requests in flight when the token
  // expires) share a single refresh call via refreshSubscribers, rather
  // than each firing its own /auth/refresh and racing to rotate the
  // refresh token — the backend's token.util.js rotates on every use,
  // so a second concurrent refresh call would find the first token
  // already revoked and fail.
  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(normalizeApiError(error));
      }

      const refreshToken = useAuthStore.getState().refreshToken;
      if (!refreshToken) {
        useAuthStore.getState().clearAuth();
        return Promise.reject(normalizeApiError(error));
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh((newToken: string) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            resolve(apiClient(originalRequest));
          });
        });
      }

      isRefreshing = true;

      try {
        // Bare axios call, not apiClient — avoids re-triggering this
        // same interceptor recursively.
        const { data } = await axios.post(`${config.apiBaseUrl}/auth/refresh`, {
          refreshToken,
        });

        const { accessToken, refreshToken: newRefreshToken } = data.data;
        useAuthStore.getState().setTokens({ accessToken, refreshToken: newRefreshToken });

        onRefreshed(accessToken);
        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        refreshSubscribers = [];
        useAuthStore.getState().clearAuth();
        if (typeof window !== 'undefined') {
          window.location.href = '/login';
        }
        return Promise.reject(normalizeApiError(refreshError));
      }
    }
  );
}


