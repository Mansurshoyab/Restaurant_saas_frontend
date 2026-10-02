// src/lib/api/modifiers.api.ts
import { apiClient } from './client';
import type { ApiResponse } from '@/types/api.types';
import type { ModifierGroup, ModifierOption } from '@/types/product.types';

export const modifiersApi = {
  listGroups: () => apiClient.get<ApiResponse<ModifierGroup[]>>('/modifiers/groups').then((r) => r.data.data),
  createGroup: (payload: Partial<ModifierGroup>) =>
    apiClient.post<ApiResponse<ModifierGroup>>('/modifiers/groups', payload).then((r) => r.data.data),
  updateGroup: (id: string, payload: Partial<ModifierGroup>) =>
    apiClient.patch<ApiResponse<ModifierGroup>>(`/modifiers/groups/${id}`, payload).then((r) => r.data.data),
  deleteGroup: (id: string) => apiClient.delete<ApiResponse<null>>(`/modifiers/groups/${id}`).then((r) => r.data),

  addModifier: (groupId: string, payload: { name: string; price: number; sortOrder?: number }) =>
    apiClient
      .post<ApiResponse<ModifierOption>>(`/modifiers/groups/${groupId}/modifiers`, payload)
      .then((r) => r.data.data),
  updateModifier: (id: string, payload: Partial<{ name: string; price: number }>) =>
    apiClient.patch<ApiResponse<ModifierOption>>(`/modifiers/${id}`, payload).then((r) => r.data.data),
  deleteModifier: (id: string) => apiClient.delete<ApiResponse<null>>(`/modifiers/${id}`).then((r) => r.data),
};


