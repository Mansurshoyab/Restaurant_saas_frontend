'use client';

import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { recipesApi } from '@/lib/api/recipes.api';
import { useProduct } from '@/lib/hooks/useProducts';
import { RecipeBuilder } from '@/components/recipes/RecipeBuilder';
import { FoodCostBreakdown } from '@/components/recipes/FoodCostBreakdown';
import { RecipeVersionHistory } from '@/components/recipes/RecipeVersionHistory';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { normalizeApiError } from '@/lib/api/client';

export default function ProductRecipePage({ params }: { params: { productId: string } }) {
  const queryClient = useQueryClient();
  const { data: product } = useProduct(params.productId);
  const { data: recipe } = useQuery({ queryKey: ['recipes', params.productId], queryFn: () => recipesApi.getActive(params.productId) });
  const { data: versions } = useQuery({ queryKey: ['recipes', params.productId, 'versions'], queryFn: () => recipesApi.listVersions(params.productId) });
  const { data: cost } = useQuery({
    queryKey: ['recipes', params.productId, 'cost'],
    queryFn: () => recipesApi.getCost(params.productId),
    enabled: !!recipe,
    retry: false,
  });

  const upsertMutation = useMutation({
    mutationFn: (items: { inventoryItemId: string; quantity: number; unit: string }[]) =>
      recipesApi.upsert({ productId: params.productId, items }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes', params.productId] });
      toast.success('Recipe saved as a new version');
    },
    onError: (err) => toast.error(normalizeApiError(err).message),
  });

  return (
    <div className="max-w-3xl">
      <PageHeader title={`Recipe — ${product?.name ?? ''}`} description="This drives ingredient consumption and food cost." />

      <div className="grid grid-cols-3 gap-4">
        <Card className="col-span-2">
          <CardHeader>
            <h2 className="text-sm font-semibold text-ink">Ingredients</h2>
          </CardHeader>
          <CardBody>
            <RecipeBuilder initialItems={recipe?.items ?? []} isSaving={upsertMutation.isPending} onSave={(items) => upsertMutation.mutate(items)} />
          </CardBody>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-ink">Food cost</h2>
            </CardHeader>
            <CardBody>
              {cost ? <FoodCostBreakdown cost={cost} /> : <p className="text-sm text-ink-muted">Save a recipe to see cost.</p>}
            </CardBody>
          </Card>

          <Card>
            <CardHeader>
              <h2 className="text-sm font-semibold text-ink">Version history</h2>
            </CardHeader>
            <CardBody>
              <RecipeVersionHistory versions={versions ?? []} />
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}


