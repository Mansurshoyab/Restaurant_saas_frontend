'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { purchasesApi } from '@/lib/api/purchases.api';
import { generateIdempotencyKey } from '@/lib/utils/idempotency';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { normalizeApiError } from '@/lib/api/client';
import { useQueryClient } from '@tanstack/react-query';
import type { PurchaseOrder } from '@/types/purchase.types';

export function GoodsReceivingForm({ po, onDone }: { po: PurchaseOrder; onDone: () => void }) {
  const queryClient = useQueryClient();
  const [receiveQty, setReceiveQty] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    const lines = po.items
      .map((item) => {
        const itemId = typeof item.inventoryItemId === 'string' ? item.inventoryItemId : item.inventoryItemId._id;
        const qty = Number(receiveQty[itemId] || 0);
        return qty > 0 ? { inventoryItemId: itemId, quantity: qty } : null;
      })
      .filter(Boolean) as { inventoryItemId: string; quantity: number }[];

    if (!lines.length) {
      toast.error('Enter a quantity for at least one item');
      return;
    }

    setIsSubmitting(true);
    try {
      await purchasesApi.receive(po._id, { lines }, generateIdempotencyKey());
      queryClient.invalidateQueries({ queryKey: ['purchases'] });
      queryClient.invalidateQueries({ queryKey: ['stock'] });
      toast.success('Goods received, stock updated');
      onDone();
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-3">
      {po.items.map((item) => {
        const itemId = typeof item.inventoryItemId === 'string' ? item.inventoryItemId : item.inventoryItemId._id;
        const itemName = typeof item.inventoryItemId === 'string' ? itemId : item.inventoryItemId.name;
        const remaining = item.orderedQuantity - item.receivedQuantity;

        return (
          <div key={itemId} className="flex items-center justify-between gap-3 rounded-md border border-slate-200 p-3">
            <div>
              <p className="text-sm font-medium text-ink">{itemName}</p>
              <p className="text-xs text-ink-muted">
                {item.receivedQuantity} / {item.orderedQuantity} received — {remaining} outstanding
              </p>
            </div>
            <div className="w-28">
              <Input
                type="number"
                min={0}
                max={remaining}
                step="0.001"
                placeholder="0"
                disabled={remaining <= 0}
                value={receiveQty[itemId] ?? ''}
                onChange={(e) => setReceiveQty((prev) => ({ ...prev, [itemId]: e.target.value }))}
              />
            </div>
          </div>
        );
      })}

      <Button className="w-full" isLoading={isSubmitting} onClick={handleSubmit}>
        Confirm receipt
      </Button>
    </div>
  );
}



