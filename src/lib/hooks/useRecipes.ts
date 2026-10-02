'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { recipesApi } from '@/lib/api/recipes.api';
import type { RecipeItem } from '@/types/recipe.types';

export function useActiveRecipe(productId: string | undefined) {
  return useQuery({
    queryKey: ['recipes', productId],
    queryFn: () => recipesApi.getActive(productId!),
    enabled: !!productId,
  });
}

export function useRecipeVersions(productId: string | undefined) {
  return useQuery({
    queryKey: ['recipes', productId, 'versions'],
    queryFn: () => recipesApi.listVersions(productId!),
    enabled: !!productId,
  });
}

export function useRecipeCost(productId: string | undefined, hasRecipe: boolean) {
  return useQuery({
    queryKey: ['recipes', productId, 'cost'],
    queryFn: () => recipesApi.getCost(productId!),
    enabled: !!productId && hasRecipe,
    retry: false,
  });
}

export function useUpsertRecipe() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: { productId: string; items: RecipeItem[] }) => recipesApi.upsert(payload),
    onSuccess: (_, { productId }) => {
      queryClient.invalidateQueries({ queryKey: ['recipes', productId] });
    },
  });
}

