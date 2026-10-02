'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tablesApi } from '@/lib/api/tables.api';

export function useTables(params?: { diningAreaId?: string }) {
  return useQuery({ queryKey: ['tables', params], queryFn: () => tablesApi.list(params) });
}

export function useTable(id: string | undefined) {
  return useQuery({
    queryKey: ['tables', id],
    queryFn: () => tablesApi.getById(id!),
    enabled: !!id,
  });
}

export function useDiningAreas() {
  return useQuery({ queryKey: ['dining-areas'], queryFn: tablesApi.listDiningAreas });
}

export function useCreateDiningArea() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => tablesApi.createDiningArea(name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dining-areas'] }),
  });
}

export function useCreateTable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { diningAreaId?: string; label: string; seats?: number }) => tablesApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tables'] }),
  });
}

export function useUpdateTable() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<{ label: string; seats: number; status: string }> }) =>
      tablesApi.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['tables'] }),
  });
}


