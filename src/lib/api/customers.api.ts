import { apiClient } from './client';
import type { ApiResponse } from '@/types/api.types';

export interface Customer {
  _id: string;
  name: string | null;
  phone: string | null;
  address: string | null;
  notes: string | null;
  createdAt: string;
}

export const customersApi = {
  list: (params?: { search?: string }) =>
    apiClient.get<ApiResponse<Customer[]>>('/customers', { params }).then((r) => r.data.data),

  getById: (id: string) => apiClient.get<ApiResponse<Customer>>(`/customers/${id}`).then((r) => r.data.data),
};


