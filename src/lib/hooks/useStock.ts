'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { stockApi } from '@/lib/api/inventory.api';
import type { InventoryUnit, StockTxType } from '@/lib/constants';

export function useStockBalances(lowStockOnly = false) {
  return useQuery({
    queryKey: ['stock', 'balances', { lowStockOnly }],
    queryFn: () => stockApi.listBalances({ lowStockOnly }),
  });
}

export function useStockTransactions(params?: { inventoryItemId?: string; type?: StockTxType }) {
  return useQuery({
    queryKey: ['stock', 'transactions', params],
    queryFn: () => stockApi.listTransactions(params),
  });
}

export function useRecordWaste() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: stockApi.recordWaste,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stock'] });
    },
  });
}

export function useRecordAdjustment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: stockApi.recordAdjustment,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stock'] }),
  });
}

export function useRecordTransfer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: stockApi.recordTransfer,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['stock'] }),
  });
}


