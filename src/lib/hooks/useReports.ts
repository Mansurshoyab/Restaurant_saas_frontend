'use client';

import { useQuery } from '@tanstack/react-query';
import { reportsApi, type DateRangeParams } from '@/lib/api/reports.api';

export function useSalesReport(params?: DateRangeParams) {
  return useQuery({ queryKey: ['reports', 'sales', params], queryFn: () => reportsApi.sales(params) });
}

export function useSalesTimeseries(params?: DateRangeParams & { granularity?: 'day' | 'month' }) {
  return useQuery({
    queryKey: ['reports', 'sales-timeseries', params],
    queryFn: () => reportsApi.salesTimeseries(params),
  });
}

export function usePaymentReport(params?: DateRangeParams) {
  return useQuery({ queryKey: ['reports', 'payments', params], queryFn: () => reportsApi.payments(params) });
}

export function useTopProducts(params?: DateRangeParams & { limit?: number; sortBy?: 'quantity' | 'revenue' }) {
  return useQuery({ queryKey: ['reports', 'products', params], queryFn: () => reportsApi.products(params) });
}

export function useInventoryValuation() {
  return useQuery({ queryKey: ['reports', 'inventory-valuation'], queryFn: reportsApi.inventoryValuation });
}

export function useWasteReport(params?: DateRangeParams) {
  return useQuery({ queryKey: ['reports', 'waste', params], queryFn: () => reportsApi.waste(params) });
}

export function useProfitabilityReport(params?: DateRangeParams) {
  return useQuery({
    queryKey: ['reports', 'profitability', params],
    queryFn: () => reportsApi.profitability(params),
  });
}


