'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '@/lib/api/inventory.api';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { INVENTORY_UNIT } from '@/lib/constants';
import { normalizeApiError } from '@/lib/api/client';
import type { InventoryItem } from '@/types/inventory.types';

export function ItemEditForm({ item }: { item: InventoryItem }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: item.name, sku: item.sku || '', unit: item.unit });

  const updateMutation = useMutation({
    mutationFn: () =>
      inventoryApi.updateItem(item._id, {
        name: form.name,
        sku: form.sku || undefined,
        unit: form.unit as any,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      queryClient.invalidateQueries({ queryKey: ['inventory', item._id] });
      toast.success('Item updated successfully');
    },
    onError: (err) => toast.error(normalizeApiError(err).message),
  });

  return (
    <Card>
      <CardHeader>
        <h2 className="text-sm font-semibold text-ink">Update Item</h2>
      </CardHeader>
      <CardBody>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            updateMutation.mutate();
          }}
          className="space-y-4"
        >
          <Input label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
          <Input label="SKU (optional)" value={form.sku} onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))} />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-ink">Unit</label>
            <select
              value={form.unit}
              onChange={(e) => setForm((f) => ({ ...f, unit: e.target.value }))}
              className="h-11 w-full rounded-md border border-slate-200 px-3.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            >
              {Object.values(INVENTORY_UNIT).map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
          <Button type="submit" isLoading={updateMutation.isPending}>
            Save Changes
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
