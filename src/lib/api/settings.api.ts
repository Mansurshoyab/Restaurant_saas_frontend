// src/lib/api/settings.api.ts
import { apiClient } from './client';
import type { ApiResponse } from '@/types/api.types';

export interface RestaurantSettings {
  name?: string | null;
  logo?: string | null;
  phone?: string | null;
  currency: string;
  taxRatePercent: number;
  taxInclusive: boolean;
  receiptHeader: string | null;
  receiptFooter: string | null;
  paymentMethodsEnabled: string[];
  businessHours: { open: string; close: string };
  timezone: string;
}

export const settingsApi = {
  get: () => apiClient.get<ApiResponse<RestaurantSettings>>('/settings').then((r) => r.data.data),
  update: (payload: Partial<RestaurantSettings>) =>
    apiClient.patch<ApiResponse<RestaurantSettings>>('/settings', payload).then((r) => r.data.data),
  uploadLogo: (file: File) => {
    const formData = new FormData();
    formData.append('logo', file);
    return apiClient
      .post<ApiResponse<RestaurantSettings>>('/settings/logo', formData, {
        headers: { 'Content-Type': undefined },
      })
      .then((r) => r.data.data);
  },
};


