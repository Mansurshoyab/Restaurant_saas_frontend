'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { inventoryApi } from '@/lib/api/inventory.api';
import { stockApi } from '@/lib/api/inventory.api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { DataTable } from '@/components/shared/DataTable';
import { INVENTORY_UNIT } from '@/lib/constants';
import { normalizeApiError } from '@/lib/api/client';

export default function InventoryItemsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: items } = useQuery({ queryKey: ['inventory'], queryFn: () => inventoryApi.listItems() });
  const { data: balances } = useQuery({ queryKey: ['stock', 'balances', {}], queryFn: () => stockApi.listBalances() });

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', unit: INVENTORY_UNIT.KG as string });

  const createMutation = useMutation({
    mutationFn: inventoryApi.createItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inventory'] });
      setShowForm(false);
      setForm({ name: '', unit: INVENTORY_UNIT.KG });
      toast.success('Inventory item created');
    },
    onError: (err) => toast.error(normalizeApiError(err).message),
  });

  const balanceByItem = new Map((balances ?? []).map((b) => [typeof b.inventoryItemId === 'string' ? b.inventoryItemId : (b.inventoryItemId as any)._id, b]));

  return (
    <div>
      <PageHeader
        title="Inventory items"
        description="Physical ingredients and packaging — separate from menu products."
        action={
          <Button onClick={() => setShowForm(true)}>
            <Plus className="h-4 w-4" /> Add item
          </Button>
        }
      />

      {showForm && (
        <Card className="mb-4">
          <CardBody>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createMutation.mutate({ name: form.name, unit: form.unit as any });
              }}
              className="flex items-end gap-3"
            >
              <div className="flex-1">
                <Input label="Item name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} autoFocus required />
              </div>
              <div className="w-40 space-y-1.5">
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
              <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
            </form>
          </CardBody>
        </Card>
      )}

      <Card>
        <CardBody>
          <DataTable
            data={items}
            onRowClick={(i) => router.push(`/inventory/items/${i._id}`)}
            emptyMessage="No inventory items yet."
            columns={[
              { header: 'Name', accessor: (i) => i.name },
              { header: 'Unit', accessor: (i) => i.unit },
              {
                header: 'Current stock',
                accessor: (i) => {
                  const balance = balanceByItem.get(i._id);
                  if (!balance) return '—';
                  const isLow = balance.minimumStock !== null && balance.quantity <= balance.minimumStock;
                  return (
                    <span className="flex items-center gap-2">
                      {balance.quantity} {i.unit}
                      {isLow && <span className="rounded bg-danger/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-danger">Low Stock</span>}
                    </span>
                  );
                },
              },
              { header: 'Avg. cost', accessor: (i) => i.averageCost.toFixed(2) },
            ]}
          />
        </CardBody>
      </Card>
    </div>
  );
}


