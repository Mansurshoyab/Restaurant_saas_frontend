'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { platformApi } from '@/lib/api/platform.api';
import { generateIdempotencyKey } from '@/lib/utils/idempotency';
import type { Plan } from '@/types/platform.types';

export function usePlatformStats() {
  return useQuery({
    queryKey: ['platform', 'stats'],
    queryFn: () => platformApi.getStats(),
  });
}

export function usePlatformUsage(params?: { from?: string; to?: string }) {
  return useQuery({
    queryKey: ['platform', 'usage', params],
    queryFn: () => platformApi.getUsage(params),
  });
}

export function usePlatformPlans(params?: { includeInactive?: boolean }) {
  return useQuery({
    queryKey: ['platform', 'plans', params],
    queryFn: () => platformApi.listPlans(params),
  });
}

export function useCreatePlatformPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Partial<Plan>) => platformApi.createPlan(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platform', 'plans'] });
    },
  });
}

export function useUpdatePlatformPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<Plan> }) =>
      platformApi.updatePlan(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platform', 'plans'] });
    },
  });
}

export function useDeactivatePlatformPlan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => platformApi.deactivatePlan(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platform', 'plans'] });
    },
  });
}

export function usePlatformOrganizations(params?: {
  status?: string;
  subscriptionStatus?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ['platform', 'organizations', params],
    queryFn: () => platformApi.listOrganizations(params),
  });
}

export function usePlatformOrganizationDetail(id: string) {
  return useQuery({
    queryKey: ['platform', 'organizations', id],
    queryFn: () => platformApi.getOrganizationDetail(id),
    enabled: !!id,
  });
}

export function useUpdateOrganizationStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: { status: string; reason: string } }) =>
      platformApi.updateOrganizationStatus(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platform', 'organizations'] });
    },
  });
}

export function usePendingSubscriptionRequests() {
  return useQuery({
    queryKey: ['platform', 'subscription-requests', 'pending'],
    queryFn: () => platformApi.listPendingSubscriptionRequests(),
  });
}

export function useSubscriptionRequestDetail(id: string) {
  return useQuery({
    queryKey: ['platform', 'subscription-requests', id],
    queryFn: () => platformApi.getSubscriptionRequestDetail(id),
    enabled: !!id,
  });
}

export function useReviewSubscriptionRequest() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: { action: 'APPROVE' | 'REJECT'; rejectionReason?: string };
    }) => {
      const idempotencyKey = generateIdempotencyKey();
      return platformApi.reviewSubscriptionRequest(id, payload, idempotencyKey);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platform', 'subscription-requests'] });
      queryClient.invalidateQueries({ queryKey: ['platform', 'organizations'] });
    },
  });
}

export function useVerifySubscriptionPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      organizationId: string;
      planId: string;
      amount: number;
      paymentReference: string;
      periodDays: number;
      notes?: string;
    }) => {
      const idempotencyKey = generateIdempotencyKey();
      return platformApi.verifySubscriptionPayment(payload, idempotencyKey);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['platform', 'subscription-requests'] });
      queryClient.invalidateQueries({ queryKey: ['platform', 'organizations'] });
    },
  });
}
