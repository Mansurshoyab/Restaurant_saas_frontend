'use client';

import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { suppliersApi, purchasesApi } from '@/lib/api/purchases.api';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/shared/DataTable';
import { PurchaseOrderStatusBadge } from '@/components/purchases/PurchaseOrderStatusBadge';
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';
import { useRouter } from 'next/navigation';
import { normalizeApiError } from '@/lib/api/client';

export default function SupplierDetailPage({ params }: { params: { supplierId: string } }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: supplier, isLoading } = useQuery({ queryKey: ['suppliers', params.supplierId], queryFn: () => suppliersApi.getById(params.supplierId) });
  const { data: purchaseOrders } = useQuery({
    queryKey: ['purchases', { supplierId: params.supplierId }],
    queryFn: () => purchasesApi.list({ supplierId: params.supplierId }),
  });

  const [form, setForm] = useState({ name: '', phone: '', email: '', address: '', paymentTerms: '' });

  useEffect(() => {
    if (supplier) {
      setForm({
        name: supplier.name,
        phone: supplier.phone ?? '',
        email: supplier.email ?? '',
        address: supplier.address ?? '',
        paymentTerms: supplier.paymentTerms ?? '',
      });
    }
  }, [supplier]);

  const updateMutation = useMutation({
    mutationFn: () => suppliersApi.update(params.supplierId, form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      toast.success('Supplier updated');
    },
    onError: (err) => toast.error(normalizeApiError(err).message),
  });

  const totalSpend = purchaseOrders?.reduce((sum, po) => sum + po.totalAmount, 0) ?? 0;

  if (isLoading || !supplier) return <p className="text-sm text-ink-muted">Loading…</p>;

  return (
    <div className="max-w-2xl space-y-4">
      <PageHeader title={supplier.name} />

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-ink">Details</h2>
          </CardHeader>
          <CardBody className="space-y-3">
            <Input label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            <Input label="Phone" value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} />
            <Input label="Email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            <Input label="Address" value={form.address} onChange={(e) => setForm((f) => ({ ...f, address: e.target.value }))} />
            <Input label="Payment terms" value={form.paymentTerms} onChange={(e) => setForm((f) => ({ ...f, paymentTerms: e.target.value }))} />
            <Button isLoading={updateMutation.isPending} onClick={() => updateMutation.mutate()}>
              Save
            </Button>
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-ink">Purchase history</h2>
          </CardHeader>
          <CardBody>
            <div className="mb-3 rounded-md bg-slate-50 p-3 text-sm">
              <span className="text-ink-muted">Total spend: </span>
              <CurrencyDisplay amount={totalSpend} size="sm" />
            </div>
            <DataTable
              data={purchaseOrders}
              onRowClick={(po) => router.push(`/purchasing/orders/${po._id}`)}
              emptyMessage="No purchase orders yet."
              columns={[
                { header: 'PO', accessor: (po) => po.poNumber },
                { header: 'Total', accessor: (po) => <CurrencyDisplay amount={po.totalAmount} size="sm" /> },
                { header: 'Status', accessor: (po) => <PurchaseOrderStatusBadge status={po.status} /> },
              ]}
            />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}


