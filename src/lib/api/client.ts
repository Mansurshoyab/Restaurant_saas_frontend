import axios, { type AxiosError, type AxiosInstance } from 'axios';
import { config } from '@/lib/config';
import { useAuthStore } from '@/lib/stores/authStore';
import type { ApiErrorResponse } from '@/types/api.types';

export const apiClient: AxiosInstance = axios.create({
  baseURL: config.apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
});

// Normalized error shape every hook/component can rely on, regardless
// of whether the failure was a validation error, a 401, a 403 from
// requireActiveSubscription, or a network failure.
export class ApiClientError extends Error {
  statusCode: number;
  details?: Record<string, string[]>;
  isSubscriptionLocked: boolean;

  constructor(message: string, statusCode: number, details?: Record<string, string[]>) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    // Matches the exact message requireActiveSubscription throws on the
    // backend — see src/middleware/subscription.middleware.js
    this.isSubscriptionLocked =
      statusCode === 403 && message.toLowerCase().includes('subscription');
  }
}

export function normalizeApiError(error: unknown): ApiClientError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;
    const status = axiosError.response?.status ?? 0;
    const message = axiosError.response?.data?.message ?? axiosError.message ?? 'Request failed';
    const details = axiosError.response?.data?.details;
    return new ApiClientError(message, status, details);
  }
  if (error instanceof Error) {
    return new ApiClientError(error.message, 0);
  }
  return new ApiClientError('Unknown error', 0);
}

// Branch context header — backend's tenant.middleware.js reads
// x-branch-id for staff assigned to multiple branches. Set this
// whenever the admin UI's branch switcher changes.
export function setActiveBranchHeader(branchId: string | null) {
  if (branchId) {
    apiClient.defaults.headers.common['x-branch-id'] = branchId;
  } else {
    delete apiClient.defaults.headers.common['x-branch-id'];
  }
}


