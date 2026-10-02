export interface SalesSummary {
  grossSales: number;
  totalDiscount: number;
  totalTax: number;
  netSales: number;
  orderCount: number;
  averageOrderValue: number;
}

export interface SalesTimeseriesPoint {
  date: string;
  netSales: number;
  orderCount: number;
}

export interface PaymentByMethod {
  method: string;
  total: number;
  count: number;
}

export interface PaymentReport {
  byMethod: PaymentByMethod[];
  grandTotal: number;
}

export interface TopProductRow {
  productId: string;
  productName: string;
  quantitySold: number;
  revenue: number;
}

export interface InventoryValuationCategory {
  category: string;
  value: number;
}

export interface InventoryValuationReport {
  byCategory: InventoryValuationCategory[];
  total: number;
}

export interface StockMovementRow {
  inventoryItemId: string;
  itemName: string;
  type: string;
  totalQuantity: number;
  count: number;
}

export interface WasteReportRow {
  inventoryItemId: string;
  itemName: string;
  unit: string;
  totalWasted: number;
  estimatedValue: number;
  occurrences: number;
}

export interface ProfitabilityReport {
  revenue: number;
  foodCost: number;
  discounts: number;
  expenses: number;
  estimatedProfit: number;
  note: string;
}

export interface SupplierSpendRow {
  supplierId: string;
  supplierName: string;
  totalSpend: number;
  purchaseOrderCount: number;
}


