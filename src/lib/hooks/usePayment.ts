'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { paymentsApi } from '@/lib/api/payments.api';
import { generateIdempotencyKey } from '@/lib/utils/idempotency';
import type { PayOrderPayload } from '@/types/payment.types';

export function usePayOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    // Idempotency key generated ONCE per mutation call by React Query's
    // mutationFn closure — if the mutation is retried internally by
    // axios/network layer, the same key is reused, matching the
    // backend's idempotency.middleware.js contract. A fresh call to
    // .mutate() (a genuinely new "Pay" tap) gets a fresh key.
    mutationFn: (payload: PayOrderPayload) => {
      const idempotencyKey = generateIdempotencyKey();
      return paymentsApi.pay(payload, idempotencyKey);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['orders', data.order._id] });
      queryClient.invalidateQueries({ queryKey: ['stock', 'balances'] });
      queryClient.invalidateQueries({ queryKey: ['tables'] });
      queryClient.invalidateQueries({ queryKey: ['pos', 'shifts', 'summary'] });
    },
  });
}

export function useOrderPayments(orderId: string | undefined) {
  return useQuery({
    queryKey: ['payments', 'order', orderId],
    queryFn: () => paymentsApi.listForOrder(orderId!),
    enabled: !!orderId,
  });
}


