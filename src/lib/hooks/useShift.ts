'use client';

import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { shiftsApi } from '@/lib/api/shifts.api';
import { useShiftStore } from '@/lib/stores/shiftStore';

export function useMyOpenShift() {
  const setOpenShift = useShiftStore((s) => s.setOpenShift);

  const query = useQuery({
    queryKey: ['pos', 'shifts', 'my-open'],
    queryFn: shiftsApi.getMyOpen,
  });

  useEffect(() => {
    if (query.data !== undefined) {
      setOpenShift(query.data ? { _id: query.data._id, openingCash: query.data.openingCash, openedAt: query.data.openedAt } : null);
    }
  }, [query.data, setOpenShift]);

  return query;
}

export function useShiftSummary() {
  return useQuery({
    queryKey: ['pos', 'shifts', 'summary'],
    queryFn: shiftsApi.getMySummary,
    refetchInterval: 30_000, // keep the drawer total roughly live during service
  });
}

export function useOpenShift() {
  const queryClient = useQueryClient();
  const setOpenShift = useShiftStore((s) => s.setOpenShift);

  return useMutation({
    mutationFn: shiftsApi.open,
    onSuccess: (data) => {
      setOpenShift({ _id: data._id, openingCash: data.openingCash, openedAt: data.openedAt });
      queryClient.invalidateQueries({ queryKey: ['pos', 'shifts'] });
    },
  });
}

export function useCloseShift() {
  const queryClient = useQueryClient();
  const setOpenShift = useShiftStore((s) => s.setOpenShift);

  return useMutation({
    mutationFn: ({ closingCash, notes }: { closingCash: number; notes?: string }) =>
      shiftsApi.close(closingCash, notes),
    onSuccess: () => {
      setOpenShift(null);
      queryClient.invalidateQueries({ queryKey: ['pos', 'shifts'] });
    },
  });
}


