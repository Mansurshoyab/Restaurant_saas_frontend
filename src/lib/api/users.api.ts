import { apiClient } from './client';
import type { ApiResponse } from '@/types/api.types';

export interface StaffMember {
  _id: string;
  name: string;
  email?: string;
  phone?: string;
  roleId: { _id: string; key: string; name: string } | string | null;
  branchId: { _id: string; name: string } | string;
  isActive: boolean;
  lastLoginAt: string | null;
}

export interface CreateStaffPayload {
  name: string;
  email?: string;
  phone?: string;
  password?: string;
  roleId: string;
  branchId: string;
}

export const usersApi = {
  list: (params?: { branchId?: string }) =>
    apiClient.get<ApiResponse<StaffMember[]>>('/users', { params }).then((r) => r.data.data),
  getById: (id: string) => apiClient.get<ApiResponse<StaffMember>>(`/users/${id}`).then((r) => r.data.data),
  create: (payload: CreateStaffPayload) =>
    apiClient.post<ApiResponse<StaffMember>>('/users', payload).then((r) => r.data.data),
  update: (id: string, payload: Partial<CreateStaffPayload & { isActive: boolean }>) =>
    apiClient.patch<ApiResponse<StaffMember>>(`/users/${id}`, payload).then((r) => r.data.data),
  resetPassword: (id: string, password: string) =>
    apiClient.post<ApiResponse<null>>(`/users/${id}/reset-password`, { password }).then((r) => r.data),
  deactivate: (id: string) => apiClient.delete<ApiResponse<null>>(`/users/${id}`).then((r) => r.data),
};

