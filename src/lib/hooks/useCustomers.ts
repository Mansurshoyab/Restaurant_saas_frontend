'use client';

import { useQuery } from '@tanstack/react-query';
import { customersApi } from '@/lib/api/customers.api';

export function useCustomers(search?: string) {
  return useQuery({ queryKey: ['customers', search], queryFn: () => customersApi.list({ search }) });
}

export function useCustomer(id: string | undefined) {
  return useQuery({
    queryKey: ['customers', id],
    queryFn: () => customersApi.getById(id!),
    enabled: !!id,
  });
}


