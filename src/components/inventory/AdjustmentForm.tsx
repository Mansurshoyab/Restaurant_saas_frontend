'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { inventoryApi, stockApi } from '@/lib/api/inventory.api';
import { useRecordAdjustment } from '@/lib/hooks/useStock';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { normalizeApiError } from '@/lib/api/client';

export function AdjustmentForm({ onDone }: { onDone: () => void }) {
  const { data: items } = useQuery({ queryKey: ['inventory'], queryFn: () => inventoryApi.listItems() });
  const recordAdjustment = useRecordAdjustment();
  const [form, setForm] = useState({ inventoryItemId: '', countedQuantity: '', reason: 'Physical count' });

  const selectedItem = items?.find((i) => i._id === form.inventoryItemId);

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          await recordAdjustment.mutateAsync({
            inventoryItemId: form.inventoryItemId,
            countedQuantity: Number(form.countedQuantity),
            reason: form.reason,
          });
          toast.success('Adjustment recorded');
          onDone();
        } catch (err) {
          toast.error(normalizeApiError(err).message);
        }
      }}
      className="space-y-4"
    >
      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-ink">Item</label>
        <select
          value={form.inventoryItemId}
          onChange={(e) => setForm((f) => ({ ...f, inventoryItemId: e.target.value }))}
          className="h-11 w-full rounded-md border border-slate-200 px-3.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          required
        >
          <option value="">Select item</option>
          {items?.map((i) => (
            <option key={i._id} value={i._id}>
              {i.name} ({i.unit})
            </option>
          ))}
        </select>
      </div>
      <Input
        label={`Counted quantity${selectedItem ? ` (${selectedItem.unit})` : ''}`}
        type="number"
        min={0}
        step="0.001"
        value={form.countedQuantity}
        onChange={(e) => setForm((f) => ({ ...f, countedQuantity: e.target.value }))}
        required
      />
      <Input label="Reason" value={form.reason} onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))} required />
      <Button type="submit" isLoading={recordAdjustment.isPending}>
        Save adjustment
      </Button>
    </form>
  );
}



