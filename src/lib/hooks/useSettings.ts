'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { settingsApi, type RestaurantSettings } from '@/lib/api/settings.api';

export function useSettings() {
  return useQuery({ queryKey: ['settings'], queryFn: settingsApi.get });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<RestaurantSettings>) => settingsApi.update(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings'] }),
  });
}

export function useUploadLogo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => settingsApi.uploadLogo(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings'] }),
  });
}


