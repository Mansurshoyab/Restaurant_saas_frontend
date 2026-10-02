'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';
import { inventoryApi } from '@/lib/api/inventory.api';
import { useSuppliers } from '@/lib/hooks/useSuppliers';
import { useCreatePurchaseOrder } from '@/lib/hooks/usePurchases';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { PurchaseOrderLineForm } from '@/components/purchases/PurchaseOrderLineForm';
import { normalizeApiError } from '@/lib/api/client';
import type { CreatePOItemInput } from '@/lib/api/purchases.api';

export default function NewPurchaseOrderPage() {
  const router = useRouter();
  const { data: suppliers } = useSuppliers();
  const { data: items } = useQuery({ queryKey: ['inventory'], queryFn: () => inventoryApi.listItems() });
  const createPO = useCreatePurchaseOrder();

  const [supplierId, setSupplierId] = useState('');
  const [lines, setLines] = useState<CreatePOItemInput[]>([{ inventoryItemId: '', orderedQuantity: 0, unitCost: 0 }]);

  const updateLine = (i: number, patch: Partial<CreatePOItemInput>) =>
    setLines((prev) => prev.map((l, idx) => (idx === i ? { ...l, ...patch } : l)));

  const total = lines.reduce((sum, l) => sum + l.orderedQuantity * l.unitCost, 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const po = await createPO.mutateAsync({ supplierId, items: lines });
      toast.success('Purchase order created');
      router.push(`/purchasing/orders/${po._id}`);
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    }
  };

  return (
    <div className="max-w-2xl">
      <PageHeader title="New purchase order" />
      <Card>
        <CardBody>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Select label="Supplier" value={supplierId} onChange={(e) => setSupplierId(e.target.value)} required>
              <option value="">Select supplier</option>
              {suppliers?.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name}
                </option>
              ))}
            </Select>

            <div className="space-y-3">
              {lines.map((line, i) => (
                <PurchaseOrderLineForm
                  key={i}
                  line={line}
                  inventoryItems={items}
                  onChange={(patch) => updateLine(i, patch)}
                  onRemove={() => setLines((prev) => prev.filter((_, idx) => idx !== i))}
                  showRemove={lines.length > 1}
                />
              ))}
              <button
                type="button"
                onClick={() => setLines((prev) => [...prev, { inventoryItemId: '', orderedQuantity: 0, unitCost: 0 }])}
                className="flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand-hover"
              >
                <Plus className="h-4 w-4" /> Add line
              </button>
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 pt-4">
              <span className="text-sm font-medium text-ink-muted">Total</span>
              <span className="tabular text-lg font-semibold">{total.toFixed(2)}</span>
            </div>

            <Button type="submit" isLoading={createPO.isPending}>
              Create purchase order
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}


