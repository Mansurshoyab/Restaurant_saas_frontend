import type { PurchaseStatus } from '@/lib/constants';

export interface PurchaseOrderItem {
  inventoryItemId: string | { _id: string; name: string; unit: string };
  orderedQuantity: number;
  receivedQuantity: number;
  unitCost: number;
}

export interface PurchaseOrder {
  _id: string;
  poNumber: string;
  supplierId: string | { _id: string; name: string };
  items: PurchaseOrderItem[];
  status: PurchaseStatus;
  totalAmount: number;
  createdAt: string;
}

export interface Supplier {
  _id: string;
  name: string;
  contactPerson: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  paymentTerms: string | null;
  isActive: boolean;
}



