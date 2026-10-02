import { apiClient } from './client';
import type { ApiResponse } from '@/types/api.types';
import type { CreateProductPayload, MenuProduct } from '@/types/product.types';

export interface ListProductsParams {
  categoryId?: string;
  branchId?: string;
  includeInactive?: boolean;
  search?: string;
}

export const productsApi = {
  list: (params?: ListProductsParams) =>
    apiClient.get<ApiResponse<MenuProduct[]>>('/products', { params }).then((r) => r.data.data),

  getById: (id: string) =>
    apiClient.get<ApiResponse<MenuProduct>>(`/products/${id}`).then((r) => r.data.data),

  create: (payload: CreateProductPayload) =>
    apiClient.post<ApiResponse<MenuProduct>>('/products', payload).then((r) => r.data.data),

  update: (id: string, payload: Partial<CreateProductPayload>) =>
    apiClient.patch<ApiResponse<MenuProduct>>(`/products/${id}`, payload).then((r) => r.data.data),

  deactivate: (id: string) => apiClient.delete<ApiResponse<null>>(`/products/${id}`).then((r) => r.data),

  uploadImage: (id: string, file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return apiClient
      .post<ApiResponse<MenuProduct>>(`/products/${id}/image`, formData, {
        headers: { 'Content-Type': undefined },
      })
      .then((r) => r.data.data);
  },
};


