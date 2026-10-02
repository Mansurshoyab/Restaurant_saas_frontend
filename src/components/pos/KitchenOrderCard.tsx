'use client';

import { toast } from 'sonner';
import { useUpdateOrderStatus } from '@/lib/hooks/useOrders';
import { Button } from '@/components/ui/Button';
import { formatRelative } from '@/lib/utils/date';
import { ORDER_STATUS, type OrderStatus } from '@/lib/constants';
import { normalizeApiError } from '@/lib/api/client';
import type { Order } from '@/types/order.types';

const NEXT_STEP: Partial<Record<OrderStatus, { label: string; status: OrderStatus }>> = {
  [ORDER_STATUS.CONFIRMED]: { label: 'Start preparing', status: ORDER_STATUS.PREPARING },
  [ORDER_STATUS.PREPARING]: { label: 'Mark ready', status: ORDER_STATUS.READY },
  [ORDER_STATUS.READY]: { label: 'Mark served', status: ORDER_STATUS.SERVED },
};

export function KitchenOrderCard({ order }: { order: Order }) {
  const updateStatus = useUpdateOrderStatus();
  const nextAction = NEXT_STEP[order.status];

  const handleAdvance = async () => {
    if (!nextAction) return;
    try {
      await updateStatus.mutateAsync({ id: order._id, status: nextAction.status });
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    }
  };

  return (
    <div className="flex flex-col rounded-lg border-2 border-slate-200 bg-white p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="font-semibold text-ink">{order.orderNumber}</span>
        <span className="text-xs text-ink-muted">{formatRelative(order.createdAt)}</span>
      </div>

      <div className="mb-3 flex-1 space-y-1">
        {order.items.map((item) => (
          <div key={item._id} className="text-sm">
            <span className="font-medium text-ink">{item.quantity}×</span> {item.productName}
            {item.modifiers.length > 0 && (
              <span className="block pl-4 text-xs text-ink-muted">{item.modifiers.map((m) => m.name).join(', ')}</span>
            )}
          </div>
        ))}
      </div>

      {nextAction && (
        <Button variant="secondary" className="w-full" isLoading={updateStatus.isPending} onClick={handleAdvance}>
          {nextAction.label}
        </Button>
      )}
      {!nextAction && order.status === ORDER_STATUS.SERVED && (
        <p className="text-center text-xs text-ink-muted">Waiting for payment at the counter</p>
      )}
    </div>
  );
}


