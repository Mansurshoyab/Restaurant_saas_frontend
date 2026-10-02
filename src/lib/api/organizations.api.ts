import { apiClient } from './client';
import type { ApiResponse } from '@/types/api.types';
import type { Organization, UpdateOrganizationPayload } from '@/types/organization.types';

export const organizationsApi = {
  getMine: () => apiClient.get<ApiResponse<Organization>>('/organizations/me').then((r) => r.data.data),

  updateMine: (payload: UpdateOrganizationPayload) =>
    apiClient.patch<ApiResponse<Organization>>('/organizations/me', payload).then((r) => r.data.data),
};


