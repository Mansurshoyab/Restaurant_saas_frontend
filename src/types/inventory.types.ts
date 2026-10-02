import type { InventoryUnit, StockTxType } from '@/lib/constants';

export interface InventoryItem {
  _id: string;
  name: string;
  sku: string | null;
  categoryId: { _id: string; name: string } | string | null;
  unit: InventoryUnit;
  averageCost: number;
  isActive: boolean;
}

export interface StockBalance {
  _id: string;
  inventoryItemId: InventoryItem | string;
  quantity: number;
  minimumStock: number;
  reorderLevel: number;
  maximumStock: number | null;
}

export interface StockTransaction {
  _id: string;
  inventoryItemId: { _id: string; name: string; unit: string } | string;
  type: StockTxType;
  quantity: number;
  unitCost: number | null;
  reference: string | null;
  reason: string | null;
  createdBy: string;
  createdAt: string;
}


