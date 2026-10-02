import { apiClient } from './client';
import type { ApiResponse } from '@/types/api.types';
import type { InventoryItem, StockBalance, StockTransaction } from '@/types/inventory.types';
import type { InventoryUnit, StockTxType } from '@/lib/constants';

export const inventoryApi = {
  listItems: (params?: { includeInactive?: boolean; categoryId?: string }) =>
    apiClient.get<ApiResponse<InventoryItem[]>>('/inventory', { params }).then((r) => r.data.data),

  getItem: (id: string) => apiClient.get<ApiResponse<InventoryItem>>(`/inventory/${id}`).then((r) => r.data.data),

  createItem: (payload: { name: string; sku?: string; categoryId?: string; unit: InventoryUnit }) =>
    apiClient.post<ApiResponse<InventoryItem>>('/inventory', payload).then((r) => r.data.data),

  updateItem: (id: string, payload: Partial<{ name: string; sku: string; unit: InventoryUnit }>) =>
    apiClient.patch<ApiResponse<InventoryItem>>(`/inventory/${id}`, payload).then((r) => r.data.data),
};

export const stockApi = {
  listBalances: (params?: { lowStockOnly?: boolean }) =>
    apiClient.get<ApiResponse<StockBalance[]>>('/stock/balances', { params }).then((r) => r.data.data),

  getBalance: (itemId: string) =>
    apiClient.get<ApiResponse<StockBalance>>(`/stock/balances/${itemId}`).then((r) => r.data.data),

  setReorderLevels: (
    itemId: string,
    payload: { minimumStock?: number; reorderLevel?: number; maximumStock?: number | null }
  ) =>
    apiClient
      .patch<ApiResponse<StockBalance>>(`/stock/balances/${itemId}/reorder-levels`, payload)
      .then((r) => r.data.data),

  recordWaste: (payload: { inventoryItemId: string; quantity: number; reason: string }) =>
    apiClient.post<ApiResponse<unknown>>('/stock/waste', payload).then((r) => r.data.data),

  recordAdjustment: (payload: { inventoryItemId: string; countedQuantity: number; reason: string }) =>
    apiClient.post<ApiResponse<unknown>>('/stock/adjustments', payload).then((r) => r.data.data),

  recordTransfer: (payload: { inventoryItemId: string; toBranchId: string; quantity: number }) =>
    apiClient.post<ApiResponse<unknown>>('/stock/transfers', payload).then((r) => r.data.data),

  listTransactions: (params?: { inventoryItemId?: string; type?: StockTxType; from?: string; to?: string }) =>
    apiClient.get<ApiResponse<StockTransaction[]>>('/stock/transactions', { params }).then((r) => r.data.data),
};


