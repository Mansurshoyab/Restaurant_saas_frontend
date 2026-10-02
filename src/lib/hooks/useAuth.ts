'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '@/lib/api/auth.api';
import { useAuthStore } from '@/lib/stores/authStore';
import type { LoginPayload, RegisterPayload, VerifyOtpPayload } from '@/types/auth.types';

export function useLogin() {
  const setTokens = useAuthStore((s) => s.setTokens);

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (data) => setTokens(data),
  });
}

export function useRegister() {
  const setTokens = useAuthStore((s) => s.setTokens);

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: (data) => setTokens(data),
  });
}

export function useRequestOtp() {
  return useMutation({ mutationFn: authApi.requestOtp });
}

export function useVerifyOtp() {
  const setTokens = useAuthStore((s) => s.setTokens);

  return useMutation({
    mutationFn: (payload: VerifyOtpPayload) => authApi.verifyOtp(payload),
    onSuccess: (data) => setTokens(data),
  });
}

export function useLogout() {
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => (refreshToken ? authApi.logout(refreshToken) : Promise.resolve(null)),
    onSettled: () => {
      clearAuth();
      queryClient.clear();
    },
  });
}

export function useCurrentUser() {
  const isAuthenticated = useAuthStore((s) => !!s.accessToken);

  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.me,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
}

export function useChangePassword() {
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return useMutation({
    mutationFn: authApi.changePassword,
    // Backend revokes all refresh tokens on password change — force
    // a fresh login rather than silently failing on the next refresh.
    onSuccess: () => clearAuth(),
  });
}

export function useForgotPasswordFlow() {
  const requestOtp = useRequestOtp();
  const verifyOtp = useVerifyOtp();
  const changePassword = useChangePassword();

  return { requestOtp, verifyOtp, changePassword };
}
