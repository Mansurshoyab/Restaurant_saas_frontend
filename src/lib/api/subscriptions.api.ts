import { apiClient } from './client';
import type { ApiResponse } from '@/types/api.types';
import type { Plan, Subscription, SubscriptionRequest, SubmitPaymentRequestInput } from '@/types/subscription.types';

export const subscriptionsApi = {
  getMine: () => apiClient.get<ApiResponse<Subscription | null>>('/subscriptions/me').then((r) => r.data.data),

  listPlans: () => apiClient.get<ApiResponse<Plan[]>>('/subscriptions/plans').then((r) => r.data.data),

  submitPaymentRequest: (input: SubmitPaymentRequestInput) => {
    const formData = new FormData();
    formData.append('planId', input.planId);
    formData.append('senderBkashNumber', input.senderBkashNumber);
    formData.append('transactionId', input.transactionId);
    if (input.screenshot) formData.append('screenshot', input.screenshot);

    return apiClient
      .post<ApiResponse<SubscriptionRequest>>('/subscriptions/payment-requests', formData, {
        headers: { 'Content-Type': undefined },
      })
      .then((r) => r.data.data);
  },

  listMyRequests: () =>
    apiClient.get<ApiResponse<SubscriptionRequest[]>>('/subscriptions/payment-requests/my').then((r) => r.data.data),
};


