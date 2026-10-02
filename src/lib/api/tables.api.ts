// src/lib/api/tables.api.ts
import { apiClient } from './client';
import type { ApiResponse } from '@/types/api.types';

export interface Table {
  _id: string;
  label: string;
  seats: number;
  status: 'AVAILABLE' | 'OCCUPIED' | 'RESERVED';
  currentOrderId: string | null;
  diningAreaId: string | { _id: string; name: string } | null;
}

export const tablesApi = {
  listDiningAreas: () => apiClient.get<ApiResponse<any[]>>('/tables/dining-areas').then((r) => r.data.data),
  createDiningArea: (name: string) =>
    apiClient.post<ApiResponse<any>>('/tables/dining-areas', { name }).then((r) => r.data.data),

  list: (params?: { diningAreaId?: string }) =>
    apiClient.get<ApiResponse<Table[]>>('/tables', { params }).then((r) => r.data.data),
  getById: (id: string) => apiClient.get<ApiResponse<Table>>(`/tables/${id}`).then((r) => r.data.data),
  create: (payload: { diningAreaId?: string; label: string; seats?: number }) =>
    apiClient.post<ApiResponse<Table>>('/tables', payload).then((r) => r.data.data),
  update: (id: string, payload: Partial<{ label: string; seats: number; status: string }>) =>
    apiClient.patch<ApiResponse<Table>>(`/tables/${id}`, payload).then((r) => r.data.data),
};


