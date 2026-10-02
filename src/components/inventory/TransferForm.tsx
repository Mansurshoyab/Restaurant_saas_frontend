'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { inventoryApi } from '@/lib/api/inventory.api';
import { branchesApi } from '@/lib/api/branches.api';
import { useRecordTransfer } from '@/lib/hooks/useStock';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { normalizeApiError } from '@/lib/api/client';

export function TransferForm({ onDone }: { onDone: () => void }) {
  const { data: items } = useQuery({ queryKey: ['inventory'], queryFn: () => inventoryApi.listItems() });
  const { data: branches } = useQuery({ queryKey: ['branches'], queryFn: branchesApi.list });
  const recordTransfer = useRecordTransfer();

  const [form, setForm] = useState({ inventoryItemId: '', toBranchId: '', quantity: '' });

  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault();
        try {
          await recordTransfer.mutateAsync({
            inventoryItemId: form.inventoryItemId,
            toBranchId: form.toBranchId,
            quantity: Number(form.quantity),
          });
          toast.success('Transfer completed');
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

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-ink">Destination branch</label>
        <select
          value={form.toBranchId}
          onChange={(e) => setForm((f) => ({ ...f, toBranchId: e.target.value }))}
          className="h-11 w-full rounded-md border border-slate-200 px-3.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          required
        >
          <option value="">Select branch</option>
          {branches?.map((b) => (
            <option key={b._id} value={b._id}>
              {b.name}
            </option>
          ))}
        </select>
      </div>

      <Input
        label="Quantity"
        type="number"
        min={0}
        step="0.001"
        value={form.quantity}
        onChange={(e) => setForm((f) => ({ ...f, quantity: e.target.value }))}
        required
      />

      <Button type="submit" isLoading={recordTransfer.isPending}>
        Transfer
      </Button>
    </form>
  );
}


