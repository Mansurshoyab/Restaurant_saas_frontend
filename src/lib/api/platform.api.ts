import { apiClient } from './client';
import type { ApiResponse } from '@/types/api.types';
import type {
  PlatformStats,
  PlatformUsage,
  PlatformOrganizationRow,
  OrganizationDetail,
  Plan,
  SubscriptionRequest,
} from '@/types/platform.types';

export const platformApi = {
  getStats: () =>
    apiClient.get<ApiResponse<PlatformStats>>('/platform/stats').then((r) => r.data.data),

  getUsage: (params?: { from?: string; to?: string }) =>
    apiClient.get<ApiResponse<PlatformUsage>>('/platform/usage', { params }).then((r) => r.data.data),

  listPlans: (params?: { includeInactive?: boolean }) =>
    apiClient.get<ApiResponse<Plan[]>>('/platform/plans', { params }).then((r) => r.data.data),

  createPlan: (payload: Partial<Plan>) =>
    apiClient.post<ApiResponse<Plan>>('/platform/plans', payload).then((r) => r.data.data),

  updatePlan: (id: string, payload: Partial<Plan>) =>
    apiClient.patch<ApiResponse<Plan>>(`/platform/plans/${id}`, payload).then((r) => r.data.data),

  deactivatePlan: (id: string) =>
    apiClient.delete<ApiResponse<void>>(`/platform/plans/${id}`).then((r) => r.data.data),

  listOrganizations: (params?: { status?: string; subscriptionStatus?: string; search?: string; page?: number; limit?: number }) =>
    apiClient.get<ApiResponse<PlatformOrganizationRow[]>>('/platform/organizations', { params }).then((r) => r.data),

  getOrganizationDetail: (id: string) =>
    apiClient.get<ApiResponse<OrganizationDetail>>(`/platform/organizations/${id}`).then((r) => r.data.data),

  updateOrganizationStatus: (id: string, payload: { status: string; reason: string }) =>
    apiClient.patch<ApiResponse<void>>(`/platform/organizations/${id}/status`, payload).then((r) => r.data.data),

  listPendingSubscriptionRequests: () =>
    apiClient.get<ApiResponse<SubscriptionRequest[]>>('/platform/subscription-requests').then((r) => r.data.data),

  getSubscriptionRequestDetail: (id: string) =>
    apiClient.get<ApiResponse<SubscriptionRequest>>(`/platform/subscription-requests/${id}`).then((r) => r.data.data),

  reviewSubscriptionRequest: (
    id: string,
    payload: { action: 'APPROVE' | 'REJECT'; rejectionReason?: string },
    idempotencyKey: string
  ) =>
    apiClient
      .post<ApiResponse<void>>(`/platform/subscription-requests/${id}/review`, payload, {
        headers: { 'Idempotency-Key': idempotencyKey },
      })
      .then((r) => r.data.data),

  verifySubscriptionPayment: (
    payload: {
      organizationId: string;
      planId: string;
      amount: number;
      paymentReference: string;
      periodDays: number;
      notes?: string;
    },
    idempotencyKey: string
  ) =>
    apiClient
      .post<ApiResponse<void>>('/platform/subscriptions/verify-payment', payload, {
        headers: { 'Idempotency-Key': idempotencyKey },
      })
      .then((r) => r.data.data),
};
