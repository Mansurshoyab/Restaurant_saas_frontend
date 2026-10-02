// src/lib/api/notifications.api.ts
import { apiClient } from './client';
import type { ApiResponse } from '@/types/api.types';

export interface AppNotification {
  _id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export const notificationsApi = {
  list: (params?: { unreadOnly?: boolean }) =>
    apiClient.get<ApiResponse<AppNotification[]>>('/notifications', { params }).then((r) => r.data.data),
  markAsRead: (id: string) =>
    apiClient.patch<ApiResponse<AppNotification>>(`/notifications/${id}/read`).then((r) => r.data.data),
  markAllAsRead: () => apiClient.patch<ApiResponse<null>>('/notifications/read-all').then((r) => r.data),
};


