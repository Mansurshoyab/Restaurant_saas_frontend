'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { useOrder, useCancelOrder, useUpdateOrderStatus } from '@/lib/hooks/useOrders';
import { useOrderPayments } from '@/lib/hooks/usePayment';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { OrderTimeline } from '@/components/orders/OrderTimeline';
import { OrderReceiptPreview } from '@/components/orders/OrderReceiptPreview';
import { RefundDialog } from '@/components/orders/RefundDialog';
import { CancelOrderDialog } from '@/components/orders/CancelOrderDialog';
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { formatDateTime } from '@/lib/utils/date';
import { NEXT_STATUS_OPTIONS, ORDER_STATUS_LABELS } from '@/lib/utils/orderStatus';
import { normalizeApiError } from '@/lib/api/client';

export default function OrderDetailPage({ params }: { params: { orderId: string } }) {
  const { data: order, isLoading, error } = useOrder(params.orderId);
  const { data: payments } = useOrderPayments(params.orderId);
  const cancelOrder = useCancelOrder();
  const updateStatus = useUpdateOrderStatus();

  const [showRefund, setShowRefund] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  if (isLoading) return <LoadingSpinner label="Loading order…" />;

  if (error || !order) {
    return (
      <p className="text-sm text-danger">
        Failed to load this order: {error instanceof Error ? error.message : 'Not found'}
      </p>
    );
  }

  const nextOptions = NEXT_STATUS_OPTIONS[order.status] ?? [];

  const handleAdvance = async (status: (typeof nextOptions)[number]) => {
    try {
      await updateStatus.mutateAsync({ id: order._id, status });
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    }
  };

  return (
    <div className="max-w-2xl">
      <PageHeader title={order.orderNumber} action={<OrderStatusBadge status={order.status} />} />

      <Card className="mb-4">
        <CardBody>
          <OrderTimeline current={order.status} />
        </CardBody>
      </Card>

      {nextOptions.length > 0 && (
        <div className="mb-4 flex gap-2">
          {nextOptions.map((status) => (
            <Button key={status} variant="secondary" isLoading={updateStatus.isPending} onClick={() => handleAdvance(status)}>
              Mark as {ORDER_STATUS_LABELS[status]}
            </Button>
          ))}
        </div>
      )}

      <Card className="mb-4">
        <CardHeader>
          <h2 className="text-sm font-semibold text-ink">Items</h2>
        </CardHeader>
        <CardBody className="divide-y divide-slate-100">
          {order.items.map((item) => (
            <div key={item._id} className="flex justify-between py-2 text-sm">
              <div>
                <p className="text-ink">
                  {item.quantity} × {item.productName}
                </p>
                {item.modifiers.length > 0 && (
                  <p className="text-xs text-ink-muted">{item.modifiers.map((m) => m.name).join(', ')}</p>
                )}
              </div>
              <CurrencyDisplay amount={item.subtotal} size="sm" />
            </div>
          ))}
          <div className="space-y-1 pt-2 text-sm">
            <div className="flex justify-between text-ink-muted">
              <span>Subtotal</span>
              <CurrencyDisplay amount={order.subtotal} size="sm" />
            </div>
            <div className="flex justify-between text-ink-muted">
              <span>Tax</span>
              <CurrencyDisplay amount={order.tax} size="sm" />
            </div>
            <div className="flex justify-between font-medium">
              <span>Total</span>
              <CurrencyDisplay amount={order.total} />
            </div>
          </div>
        </CardBody>
      </Card>

      <Card className="mb-4">
        <CardHeader>
          <h2 className="text-sm font-semibold text-ink">Payments</h2>
        </CardHeader>
        <CardBody className="divide-y divide-slate-100">
          {!payments?.length ? (
            <p className="py-2 text-sm text-ink-muted">No payments recorded yet.</p>
          ) : (
            payments.map((p) => (
              <div key={p._id} className="flex justify-between py-2 text-sm">
                <span>
                  {p.method} — {formatDateTime(p.createdAt)}
                </span>
                <CurrencyDisplay amount={p.amount} size="sm" />
              </div>
            ))
          )}
        </CardBody>
      </Card>

      <div className="flex gap-2">
        <Button variant="secondary" onClick={() => setShowReceipt((v) => !v)}>
          {showReceipt ? 'Hide receipt' : 'Preview receipt'}
        </Button>
        {order.paymentStatus === 'PAID' && (
          <Button variant="danger" onClick={() => setShowRefund(true)}>
            Issue refund
          </Button>
        )}
        {order.paymentStatus === 'UNPAID' && (
          <>
            <Link href={`/pos/order/${order._id}/pay`}>
              <Button variant="primary">Take payment</Button>
            </Link>
            <Button variant="ghost" className="text-danger" onClick={() => setShowCancel(true)}>
              Cancel order
            </Button>
          </>
        )}
      </div>

      {showReceipt && (
        <div className="mt-4">
          <OrderReceiptPreview order={order} />
        </div>
      )}

      {showRefund && <RefundDialog orderId={order._id} maxAmount={order.total} onClose={() => setShowRefund(false)} />}

      {showCancel && (
        <CancelOrderDialog
          isLoading={cancelOrder.isPending}
          onCancel={() => setShowCancel(false)}
          onConfirm={async (reason) => {
            try {
              await cancelOrder.mutateAsync({ id: order._id, reason });
              toast.success('Order cancelled');
              setShowCancel(false);
            } catch (err) {
              toast.error(normalizeApiError(err).message);
            }
          }}
        />
      )}
    </div>
  );
}


