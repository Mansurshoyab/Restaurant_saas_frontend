import { apiClient } from './client';
import type { ApiResponse } from '@/types/api.types';

export interface Role {
  _id: string;
  key: string;
  name: string;
  permissions: string[];
  isSystem: boolean;
}

export interface Permission {
  key: string;
  module: string;
  description: string;
}

export const rolesApi = {
  list: () => apiClient.get<ApiResponse<Role[]>>('/roles').then((r) => r.data.data),
  listPermissions: () => apiClient.get<ApiResponse<Permission[]>>('/roles/permissions').then((r) => r.data.data),
  create: (payload: { key: string; name: string; permissions: string[] }) =>
    apiClient.post<ApiResponse<Role>>('/roles', payload).then((r) => r.data.data),
  update: (id: string, payload: Partial<{ name: string; permissions: string[] }>) =>
    apiClient.patch<ApiResponse<Role>>(`/roles/${id}`, payload).then((r) => r.data.data),
  delete: (id: string) => apiClient.delete<ApiResponse<null>>(`/roles/${id}`).then((r) => r.data),
};


