'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { inventoryApi } from '@/lib/api/inventory.api';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { INVENTORY_UNIT } from '@/lib/constants';
import { normalizeApiError } from '@/lib/api/client';

export default function NewInventoryItemPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: '', sku: '', unit: INVENTORY_UNIT.KG as string });

  const createMutation = useMutation({
    mutationFn: () => inventoryApi.createItem({ name: form.name, sku: form.sku || undefined, unit: form.unit as any }),
    onSuccess: (item) => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      toast.success('Inventory item created');
      router.push(`/inventory/items/${item._id}`);
    },
    onError: (err) => toast.error(normalizeApiError(err).message),
  });

  return (
    <div className="max-w-md">
      <PageHeader title="Add inventory item" />
      <Card>
        <CardBody>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              createMutation.mutate();
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
            <Button type="submit" isLoading={createMutation.isPending}>
              Create
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}


