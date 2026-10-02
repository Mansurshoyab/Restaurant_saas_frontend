'use client';

import { useQuery } from '@tanstack/react-query';
import { inventoryApi, stockApi } from '@/lib/api/inventory.api';
import { useStockTransactions } from '@/lib/hooks/useStock';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { StockTransactionTimeline } from '@/components/inventory/StockTransactionTimeline';
import { ReorderLevelsForm } from '@/components/inventory/ReorderLevelsForm';
import { ItemEditForm } from '@/components/inventory/ItemEditForm';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function InventoryItemDetailPage({ params }: { params: { itemId: string } }) {
  const { data: item, isLoading } = useQuery({ queryKey: ['inventory', params.itemId], queryFn: () => inventoryApi.getItem(params.itemId) });
  const { data: balance } = useQuery({ queryKey: ['stock', 'balance', params.itemId], queryFn: () => stockApi.getBalance(params.itemId) });
  const { data: transactions } = useStockTransactions({ inventoryItemId: params.itemId });

  if (isLoading || !item) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl space-y-4">
      <PageHeader title={item.name} description={`Unit: ${item.unit} · Avg. cost: ${item.averageCost.toFixed(2)}`} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-4">
          <ItemEditForm item={item} />
        </div>

        <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-ink">Reorder levels</h2>
          </CardHeader>
          <CardBody className="space-y-3">
            <div className="rounded-md bg-slate-50 p-3 text-sm">
              <span className="text-ink-muted">Current stock: </span>
              <span className="tabular font-medium">
                {balance?.quantity ?? 0} {item.unit}
              </span>
            </div>
            <ReorderLevelsForm itemId={params.itemId} balance={balance} />
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-ink">Stock history</h2>
          </CardHeader>
          <CardBody className="max-h-96 overflow-y-auto">
            <StockTransactionTimeline transactions={(transactions as any) ?? []} unit={item.unit} />
          </CardBody>
        </Card>
      </div>
      </div>
    </div>
  );
}