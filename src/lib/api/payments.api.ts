import { apiClient } from './client';
import type { ApiResponse } from '@/types/api.types';
import type { Order } from '@/types/order.types';
import type { Payment, PayOrderPayload, RefundPayload } from '@/types/payment.types';

export const paymentsApi = {
  pay: (payload: PayOrderPayload, idempotencyKey: string) =>
    apiClient
      .post<ApiResponse<{ order: Order; payments: Payment[] }>>('/payments', payload, {
        headers: { 'Idempotency-Key': idempotencyKey },
      })
      .then((r) => r.data.data),

  listForOrder: (orderId: string) =>
    apiClient.get<ApiResponse<Payment[]>>(`/payments/order/${orderId}`).then((r) => r.data.data),

  refund: (payload: RefundPayload) =>
    apiClient.post<ApiResponse<unknown>>('/payments/refund', payload).then((r) => r.data.data),
};


