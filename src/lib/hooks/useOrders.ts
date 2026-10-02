'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ordersApi, type ListOrdersParams } from '@/lib/api/orders.api';
import type { CreateOrderPayload } from '@/types/order.types';
import { ORDER_STATUS, type OrderStatus } from '@/lib/constants';

export function useOrders(params?: ListOrdersParams) {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => ordersApi.list(params),
    refetchInterval: 15_000,
  });
}

export function useOrder(id: string | undefined) {
  return useQuery({
    queryKey: ['orders', id],
    queryFn: () => ordersApi.getById(id!),
    enabled: !!id,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateOrderPayload) => ordersApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
  });
}

export function useConfirmOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => ordersApi.confirm(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders', id] });
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: OrderStatus }) => ordersApi.updateStatus(id, status),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders', id] });
    },
  });
}

export function useCancelOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) => ordersApi.cancel(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['tables'] });
    },
  });
}

export function useKitchenQueue() {
  return useQuery({
    queryKey: ['orders', 'kitchen-queue'],
    queryFn: async () => {
      const [confirmed, preparing, ready] = await Promise.all([
        ordersApi.list({ status: ORDER_STATUS.CONFIRMED }),
        ordersApi.list({ status: ORDER_STATUS.PREPARING }),
        ordersApi.list({ status: ORDER_STATUS.READY }),
      ]);
      return [...confirmed, ...preparing, ...ready].sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
    },
    refetchInterval: 8_000,
  });
}

