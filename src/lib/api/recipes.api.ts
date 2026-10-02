import { apiClient } from './client';
import type { ApiResponse } from '@/types/api.types';
import type { Recipe, RecipeCost, RecipeItem } from '@/types/recipe.types';

export const recipesApi = {
  getActive: (productId: string) =>
    apiClient.get<ApiResponse<Recipe | null>>(`/recipes/product/${productId}`).then((r) => r.data.data),

  listVersions: (productId: string) =>
    apiClient.get<ApiResponse<Recipe[]>>(`/recipes/product/${productId}/versions`).then((r) => r.data.data),

  getCost: (productId: string) =>
    apiClient.get<ApiResponse<RecipeCost>>(`/recipes/product/${productId}/cost`).then((r) => r.data.data),

  upsert: (payload: { productId: string; items: RecipeItem[] }) =>
    apiClient.post<ApiResponse<Recipe>>('/recipes', payload).then((r) => r.data.data),
};


