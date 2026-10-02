import { apiClient } from './client';
import type { ApiResponse } from '@/types/api.types';
import type { CreateOrderPayload, Order } from '@/types/order.types';
import type { OrderStatus } from '@/lib/constants';

export interface ListOrdersParams {
  status?: OrderStatus;
  orderType?: string;
  from?: string;
  to?: string;
}

export const ordersApi = {
  list: (params?: ListOrdersParams) =>
    apiClient.get<ApiResponse<Order[]>>('/orders', { params }).then((r) => r.data.data),

  getById: (id: string) => apiClient.get<ApiResponse<Order>>(`/orders/${id}`).then((r) => r.data.data),

  create: (payload: CreateOrderPayload) =>
    apiClient.post<ApiResponse<Order>>('/orders', payload).then((r) => r.data.data),

  addItems: (id: string, items: CreateOrderPayload['items']) =>
    apiClient.post<ApiResponse<Order>>(`/orders/${id}/items`, { items }).then((r) => r.data.data),

  updateItemQuantity: (orderId: string, itemId: string, quantity: number) =>
    apiClient
      .patch<ApiResponse<Order>>(`/orders/${orderId}/items/${itemId}`, { quantity })
      .then((r) => r.data.data),

  applyDiscount: (id: string, discount: number) =>
    apiClient.patch<ApiResponse<Order>>(`/orders/${id}/discount`, { discount }).then((r) => r.data.data),

  confirm: (id: string) => apiClient.post<ApiResponse<Order>>(`/orders/${id}/confirm`).then((r) => r.data.data),

  updateStatus: (id: string, status: OrderStatus) =>
    apiClient.patch<ApiResponse<Order>>(`/orders/${id}/status`, { status }).then((r) => r.data.data),

  cancel: (id: string, reason: string) =>
    apiClient.post<ApiResponse<Order>>(`/orders/${id}/cancel`, { reason }).then((r) => r.data.data),
};


