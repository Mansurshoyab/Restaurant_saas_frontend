// src/lib/api/categories.api.ts
import { apiClient } from './client';
import type { ApiResponse } from '@/types/api.types';
import type { Category } from '@/types/product.types';

export const categoriesApi = {
  list: (params?: { includeInactive?: boolean }) =>
    apiClient.get<ApiResponse<Category[]>>('/categories', { params }).then((r) => r.data.data),
  create: (payload: { name: string; sortOrder?: number }) =>
    apiClient.post<ApiResponse<Category>>('/categories', payload).then((r) => r.data.data),
  update: (id: string, payload: Partial<{ name: string; sortOrder: number; isActive: boolean }>) =>
    apiClient.patch<ApiResponse<Category>>(`/categories/${id}`, payload).then((r) => r.data.data),
  deactivate: (id: string) => apiClient.delete<ApiResponse<null>>(`/categories/${id}`).then((r) => r.data),
};


