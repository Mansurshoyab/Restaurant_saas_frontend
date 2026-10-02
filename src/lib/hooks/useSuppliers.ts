'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { suppliersApi } from '@/lib/api/purchases.api';
import type { Supplier } from '@/types/purchase.types';

export function useSuppliers(params?: { includeInactive?: boolean; search?: string }) {
  return useQuery({ queryKey: ['suppliers', params], queryFn: () => suppliersApi.list(params) });
}

export function useSupplier(id: string | undefined) {
  return useQuery({
    queryKey: ['suppliers', id],
    queryFn: () => suppliersApi.getById(id!),
    enabled: !!id,
  });
}

export function useCreateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Supplier>) => suppliersApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['suppliers'] }),
  });
}

export function useUpdateSupplier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Supplier> }) => suppliersApi.update(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      queryClient.invalidateQueries({ queryKey: ['suppliers', id] });
    },
  });
}


