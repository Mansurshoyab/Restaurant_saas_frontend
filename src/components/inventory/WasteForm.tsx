'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { inventoryApi } from '@/lib/api/inventory.api';
import { useRecordWaste } from '@/lib/hooks/useStock';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { normalizeApiError } from '@/lib/api/client';

export function WasteForm({ onDone }: { onDone: () => void }) {
  const { data: items } = useQuery({ queryKey: ['inventory'], queryFn: () => inventoryApi.listItems() });
  const recordWaste = useRecordWaste();
  const [form, setForm] = useState({ inventoryItemId: '', quantity: '', reason: '' });

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          await recordWaste.mutateAsync({
            inventoryItemId: form.inventoryItemId,
            quantity: Number(form.quantity),
            reason: form.reason,
          });
          toast.success('Waste recorded');
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
        label="Quantity wasted"
        type="number"
        min={0}
        step="0.001"
        value={form.quantity}
        onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
        required
      />
      <Input
        label="Reason"
        value={form.reason}
        onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
        placeholder="Spoilage, burned, dropped…"
        required
      />
      <Button type="submit" isLoading={recordWaste.isPending}>
        Record waste
      </Button>
    </form>
  );
}



