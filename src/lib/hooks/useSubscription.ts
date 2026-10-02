'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { subscriptionsApi } from '@/lib/api/subscriptions.api';
import type { SubmitPaymentRequestInput } from '@/types/subscription.types';

export function useMySubscription() {
  return useQuery({ queryKey: ['subscription', 'me'], queryFn: subscriptionsApi.getMine });
}

export function usePlans() {
  return useQuery({ queryKey: ['subscription', 'plans'], queryFn: subscriptionsApi.listPlans });
}

export function useMyPaymentRequests() {
  return useQuery({ queryKey: ['subscription', 'requests', 'mine'], queryFn: subscriptionsApi.listMyRequests });
}

export function useSubmitPaymentRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: SubmitPaymentRequestInput) => subscriptionsApi.submitPaymentRequest(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['subscription'] }),
  });
}


