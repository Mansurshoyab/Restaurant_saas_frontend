import { apiClient } from './client';
import type { ApiResponse } from '@/types/api.types';

export interface Branch {
  _id: string;
  name: string;
  address: string | null;
  phone: string | null;
  status: 'ACTIVE' | 'INACTIVE';
}

export const branchesApi = {
  list: () => apiClient.get<ApiResponse<Branch[]>>('/branches').then((r) => r.data.data),
  getById: (id: string) => apiClient.get<ApiResponse<Branch>>(`/branches/${id}`).then((r) => r.data.data),
  create: (payload: { name: string; address?: string; phone?: string }) =>
    apiClient.post<ApiResponse<Branch>>('/branches', payload).then((r) => r.data.data),
  update: (id: string, payload: Partial<{ name: string; address: string; phone: string }>) =>
    apiClient.patch<ApiResponse<Branch>>(`/branches/${id}`, payload).then((r) => r.data.data),
};


