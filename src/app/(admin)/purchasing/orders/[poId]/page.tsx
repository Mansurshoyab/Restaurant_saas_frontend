'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { usePurchaseOrder, useSubmitPurchaseOrder, useApprovePurchaseOrder } from '@/lib/hooks/usePurchases';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { PurchaseOrderStatusBadge } from '@/components/purchases/PurchaseOrderStatusBadge';
import { PurchaseOrderTimeline } from '@/components/purchases/PurchaseOrderTimeline';
import { GoodsReceivingForm } from '@/components/purchases/GoodsReceivingForm';
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { normalizeApiError } from '@/lib/api/client';

export default function PurchaseOrderDetailPage({ params }: { params: { poId: string } }) {
  const { data: po, isLoading } = usePurchaseOrder(params.poId);
  const submitPO = useSubmitPurchaseOrder();
  const approvePO = useApprovePurchaseOrder();
  const [showReceive, setShowReceive] = useState(false);

  if (isLoading || !po) return <LoadingSpinner />;

  return (
    <div className="max-w-2xl">
      <PageHeader title={po.poNumber} action={<PurchaseOrderStatusBadge status={po.status} />} />

      <Card className="mb-4">
        <CardBody>
          <PurchaseOrderTimeline current={po.status} />
        </CardBody>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <h2 className="text-sm font-semibold text-ink">Items</h2>
        </CardHeader>
        <CardBody className="divide-y divide-slate-100">
          {po.items.map((item, i) => {
            const name = typeof item.inventoryItemId === 'string' ? item.inventoryItemId : item.inventoryItemId.name;
            return (
              <div key={i} className="flex items-center justify-between py-2 text-sm">
                <span>{name}</span>
                <span className="tabular text-ink-muted">
                  {item.orderedQuantity} @ <CurrencyDisplay amount={item.unitCost} size="sm" />
                </span>
              </div>
            );
          })}
          <div className="flex justify-between pt-2 font-medium">
            <span>Total</span>
            <CurrencyDisplay amount={po.totalAmount} />
          </div>
        </CardBody>
      </Card>

      <div className="flex gap-2">
        {po.status === 'DRAFT' && (
          <Button
            isLoading={submitPO.isPending}
            onClick={async () => {
              try {
                await submitPO.mutateAsync(po._id);
                toast.success('Submitted for approval');
              } catch (err) {
                toast.error(normalizeApiError(err).message);
              }
            }}
          >
            Submit for approval
          </Button>
        )}
        {po.status === 'SUBMITTED' && (
          <Button
            isLoading={approvePO.isPending}
            onClick={async () => {
              try {
                await approvePO.mutateAsync(po._id);
                toast.success('Approved');
              } catch (err) {
                toast.error(normalizeApiError(err).message);
              }
            }}
          >
            Approve
          </Button>
        )}
        {(po.status === 'APPROVED' || po.status === 'PARTIALLY_RECEIVED') && <Button onClick={() => setShowReceive(true)}>Receive goods</Button>}
      </div>

      {showReceive && (
        <Card className="mt-4">
          <CardHeader>
            <h2 className="text-sm font-semibold text-ink">Receive goods</h2>
          </CardHeader>
          <CardBody>
            <GoodsReceivingForm po={po} onDone={() => setShowReceive(false)} />
          </CardBody>
        </Card>
      )}
    </div>
  );
}


