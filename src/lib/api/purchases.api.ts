import { apiClient } from './client';
import type { ApiResponse } from '@/types/api.types';
import type { PurchaseOrder, Supplier } from '@/types/purchase.types';

export const suppliersApi = {
  list: (params?: { includeInactive?: boolean; search?: string }) =>
    apiClient.get<ApiResponse<Supplier[]>>('/suppliers', { params }).then((r) => r.data.data),

  getById: (id: string) => apiClient.get<ApiResponse<Supplier>>(`/suppliers/${id}`).then((r) => r.data.data),

  create: (payload: Partial<Supplier>) =>
    apiClient.post<ApiResponse<Supplier>>('/suppliers', payload).then((r) => r.data.data),

  update: (id: string, payload: Partial<Supplier>) =>
    apiClient.patch<ApiResponse<Supplier>>(`/suppliers/${id}`, payload).then((r) => r.data.data),
};

export interface CreatePOItemInput {
  inventoryItemId: string;
  orderedQuantity: number;
  unitCost: number;
}

export const purchasesApi = {
  list: (params?: { status?: string; supplierId?: string }) =>
    apiClient.get<ApiResponse<PurchaseOrder[]>>('/purchases', { params }).then((r) => r.data.data),

  getById: (id: string) =>
    apiClient.get<ApiResponse<PurchaseOrder>>(`/purchases/${id}`).then((r) => r.data.data),

  create: (payload: { supplierId: string; items: CreatePOItemInput[] }) =>
    apiClient.post<ApiResponse<PurchaseOrder>>('/purchases', payload).then((r) => r.data.data),

  submit: (id: string) => apiClient.post<ApiResponse<PurchaseOrder>>(`/purchases/${id}/submit`).then((r) => r.data.data),

  approve: (id: string) =>
    apiClient.post<ApiResponse<PurchaseOrder>>(`/purchases/${id}/approve`).then((r) => r.data.data),

  receive: (
    id: string,
    payload: { lines: Array<{ inventoryItemId: string; quantity: number; unitCost?: number }> },
    idempotencyKey: string
  ) =>
    apiClient
      .post<ApiResponse<unknown>>(`/purchases/${id}/receive`, payload, {
        headers: { 'Idempotency-Key': idempotencyKey },
      })
      .then((r) => r.data.data),

  listReceipts: (id: string) => apiClient.get<ApiResponse<unknown[]>>(`/purchases/${id}/receipts`).then((r) => r.data.data),
};


