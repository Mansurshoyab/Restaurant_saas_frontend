import { apiClient } from './client';
import type { ApiResponse } from '@/types/api.types';
import type {
  SalesSummary,
  SalesTimeseriesPoint,
  PaymentReport,
  TopProductRow,
  InventoryValuationReport,
  StockMovementRow,
  WasteReportRow,
  ProfitabilityReport,
} from '@/types/report.types';

export interface DateRangeParams {
  from?: string;
  to?: string;
}

export const reportsApi = {
  sales: (params?: DateRangeParams) =>
    apiClient.get<ApiResponse<SalesSummary>>('/reports/sales', { params }).then((r) => r.data.data),

  salesTimeseries: (params?: DateRangeParams & { granularity?: 'day' | 'month' }) =>
    apiClient.get<ApiResponse<SalesTimeseriesPoint[]>>('/reports/sales/timeseries', { params }).then((r) => r.data.data),

  payments: (params?: DateRangeParams) =>
    apiClient.get<ApiResponse<PaymentReport>>('/reports/payments', { params }).then((r) => r.data.data),

  products: (params?: DateRangeParams & { limit?: number; sortBy?: 'quantity' | 'revenue' }) =>
    apiClient.get<ApiResponse<TopProductRow[]>>('/reports/products', { params }).then((r) => r.data.data),

  inventoryValuation: () =>
    apiClient.get<ApiResponse<InventoryValuationReport>>('/reports/inventory/valuation').then((r) => r.data.data),

  inventoryMovement: (params?: DateRangeParams & { inventoryItemId?: string }) =>
    apiClient.get<ApiResponse<StockMovementRow[]>>('/reports/inventory/movement', { params }).then((r) => r.data.data),

  waste: (params?: DateRangeParams) =>
    apiClient.get<ApiResponse<WasteReportRow[]>>('/reports/waste', { params }).then((r) => r.data.data),

  profitability: (params?: DateRangeParams) =>
    apiClient.get<ApiResponse<ProfitabilityReport>>('/reports/profitability', { params }).then((r) => r.data.data),
};


