'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { rolesApi } from '@/lib/api/roles.api';

export function useRoles() {
  return useQuery({ queryKey: ['roles'], queryFn: rolesApi.list });
}

export function usePermissionCatalog() {
  return useQuery({ queryKey: ['permissions'], queryFn: rolesApi.listPermissions });
}

export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: rolesApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roles'] }),
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<{ name: string; permissions: string[] }> }) =>
      rolesApi.update(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['roles'] }),
  });
}

