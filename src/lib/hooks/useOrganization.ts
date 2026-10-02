'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { organizationsApi } from '@/lib/api/organizations.api';
import type { UpdateOrganizationPayload } from '@/types/organization.types';

export function useMyOrganization() {
  return useQuery({ queryKey: ['organization', 'me'], queryFn: organizationsApi.getMine });
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateOrganizationPayload) => organizationsApi.updateMine(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['organization'] }),
  });
}



