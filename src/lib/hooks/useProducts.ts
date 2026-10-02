'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { productsApi, type ListProductsParams } from '@/lib/api/products.api';
import type { CreateProductPayload } from '@/types/product.types';

export function useProducts(params?: ListProductsParams) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productsApi.list(params),
  });
}

export function useProduct(id: string | undefined) {
  return useQuery({
    queryKey: ['products', id],
    queryFn: () => productsApi.getById(id!),
    enabled: !!id,
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateProductPayload) => productsApi.create(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['products'] }),
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Partial<CreateProductPayload> }) =>
      productsApi.update(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      queryClient.invalidateQueries({ queryKey: ['products', id] });
    },
  });
}

export function useUploadProductImage() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, file }: { id: string; file: File }) => productsApi.uploadImage(id, file),
    onSuccess: (_, { id }) => queryClient.invalidateQueries({ queryKey: ['products', id] }),
  });
}



