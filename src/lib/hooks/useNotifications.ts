'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationsApi } from '@/lib/api/notifications.api';

export function useNotifications(unreadOnly = false) {
  return useQuery({
    queryKey: ['notifications', { unreadOnly }],
    queryFn: () => notificationsApi.list({ unreadOnly }),
    refetchInterval: 60_000, // simple polling; swap for websockets later if needed
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationsApi.markAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: notificationsApi.markAllAsRead,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['notifications'] }),
  });
}


