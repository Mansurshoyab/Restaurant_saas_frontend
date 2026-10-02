'use client';

import { useKitchenQueue } from '@/lib/hooks/useOrders';
import { KitchenOrderCard } from '@/components/pos/KitchenOrderCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { ChefHat } from 'lucide-react';

export default function KitchenQueuePage() {
  const { data: orders, isLoading } = useKitchenQueue();

  return (
    <div className="h-full overflow-y-auto bg-app p-6">
      <h1 className="mb-4 text-lg font-semibold text-ink">Kitchen queue</h1>

      {isLoading ? (
        <p className="text-sm text-ink-muted">Loading…</p>
      ) : !orders?.length ? (
        <EmptyState icon={ChefHat} title="No active orders" description="New orders will appear here as soon as they're confirmed." />
      ) : (
        <div className="grid grid-cols-4 gap-4">
          {orders.map((order) => (
            <KitchenOrderCard key={order._id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}


