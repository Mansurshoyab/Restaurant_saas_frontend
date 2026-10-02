'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { usersApi, type CreateStaffPayload } from '@/lib/api/users.api';

export function useStaffList(branchId?: string) {
  return useQuery({ queryKey: ['staff', branchId], queryFn: () => usersApi.list({ branchId }) });
}

export function useStaffMember(id: string | undefined) {
  return useQuery({ queryKey: ['staff', 'detail', id], queryFn: () => usersApi.getById(id!), enabled: !!id });
}

export function useCreateStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staff'] }),
  });
}

export function useUpdateStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateStaffPayload & { isActive: boolean }> }) =>
      usersApi.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staff'] }),
  });
}

export function useResetStaffPassword() {
  return useMutation({
    mutationFn: ({ id, password }: { id: string; password: string }) => usersApi.resetPassword(id, password),
  });
}

export function useDeactivateStaff() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: usersApi.deactivate,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['staff'] }),
  });
}


