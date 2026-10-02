'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { purchasesApi, type CreatePOItemInput } from '@/lib/api/purchases.api';
import { generateIdempotencyKey } from '@/lib/utils/idempotency';

export function usePurchaseOrders(params?: { status?: string; supplierId?: string }) {
  return useQuery({ queryKey: ['purchases', params], queryFn: () => purchasesApi.list(params) });
}

export function usePurchaseOrder(id: string | undefined) {
  return useQuery({
    queryKey: ['purchases', id],
    queryFn: () => purchasesApi.getById(id!),
    enabled: !!id,
  });
}

export function useCreatePurchaseOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { supplierId: string; items: CreatePOItemInput[] }) => purchasesApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['purchases'] }),
  });
}

export function useSubmitPurchaseOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => purchasesApi.submit(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      queryClient.invalidateQueries({ queryKey: ['purchases', id] });
    },
  });
}

export function useApprovePurchaseOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => purchasesApi.approve(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      queryClient.invalidateQueries({ queryKey: ['purchases', id] });
    },
  });
}

export function useReceiveGoods() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, lines }: { id: string; lines: Array<{ inventoryItemId: string; quantity: number; unitCost?: number }> }) =>
      purchasesApi.receive(id, { lines }, generateIdempotencyKey()),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      queryClient.invalidateQueries({ queryKey: ['purchases', id] });
      queryClient.invalidateQueries({ queryKey: ['stock'] });
    },
  });
}

export function usePurchaseOrderReceipts(id: string | undefined) {
  return useQuery({
    queryKey: ['purchases', id, 'receipts'],
    queryFn: () => purchasesApi.listReceipts(id!),
    enabled: !!id,
  });
}


