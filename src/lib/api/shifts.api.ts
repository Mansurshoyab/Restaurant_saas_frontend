import { apiClient } from './client';
import type { ApiResponse } from '@/types/api.types';

export interface PosShift {
  _id: string;
  openingCash: number;
  closingCash: number | null;
  expectedCash: number | null;
  variance: number | null;
  status: 'OPEN' | 'CLOSED';
  openedAt: string;
  closedAt: string | null;
}

export interface ShiftSummary {
  shift: Pick<PosShift, '_id' | 'openedAt' | 'openingCash' | 'status'>;
  salesByMethod: Array<{ method: string; total: number; count: number }>;
  cash: {
    openingCash: number;
    cashSales: number;
    cashRefunds: number;
    cashExpenses: number;
    expectedCash: number;
  };
  ordersHandled: number;
}

export const shiftsApi = {
  getMyOpen: () => apiClient.get<ApiResponse<PosShift | null>>('/pos/shifts/my-open').then((r) => r.data.data),

  getMySummary: () =>
    apiClient.get<ApiResponse<ShiftSummary>>('/pos/shifts/my-summary').then((r) => r.data.data),

  open: (openingCash: number) =>
    apiClient.post<ApiResponse<PosShift>>('/pos/shifts/open', { openingCash }).then((r) => r.data.data),

  close: (closingCash: number, notes?: string) =>
    apiClient.post<ApiResponse<PosShift>>('/pos/shifts/close', { closingCash, notes }).then((r) => r.data.data),
};


