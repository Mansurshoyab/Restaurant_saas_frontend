'use client';

import Link from 'next/link';
import { toast } from 'sonner';
import { useOrder, useUpdateOrderStatus, useCancelOrder } from '@/lib/hooks/useOrders';
import { Button } from '@/components/ui/Button';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';
import { ORDER_STATUS_LABELS, NEXT_STATUS_OPTIONS } from '@/lib/utils/orderStatus';
import { ORDER_STATUS } from '@/lib/constants';
import { normalizeApiError } from '@/lib/api/client';

export default function ActiveOrderPage({ params }: { params: { orderId: string } }) {
  const { data: order, isLoading } = useOrder(params.orderId);
  const updateStatus = useUpdateOrderStatus();
  const cancelOrder = useCancelOrder();

  if (isLoading || !order) return <p className="p-6 text-sm text-ink-muted">Loading order…</p>;

  const nextOptions = NEXT_STATUS_OPTIONS[order.status] ?? [];
  const isPaid = order.paymentStatus === 'PAID';

  const handleStatusChange = async (status: (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS]) => {
    try {
      await updateStatus.mutateAsync({ id: order._id, status });
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    }
  };

  const handleCancel = async () => {
    const reason = window.prompt('Reason for cancelling this order:');
    if (!reason) return;
    try {
      await cancelOrder.mutateAsync({ id: order._id, reason });
      toast.success('Order cancelled');
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    }
  };

  return (
    <div className="mx-auto h-full max-w-lg overflow-y-auto p-6">
      <Card>
        <CardHeader className="flex items-center justify-between">
          <div>
            <h1 className="font-semibold text-ink">{order.orderNumber}</h1>
            <p className="text-sm text-ink-muted">{ORDER_STATUS_LABELS[order.status]}</p>
          </div>
          {!isPaid && (
            <Button variant="ghost" size="sm" className="text-danger" onClick={handleCancel}>
              Cancel order
            </Button>
          )}
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
        </CardBody>

        <CardBody className="border-t border-slate-100">
          <div className="flex items-center justify-between font-medium">
            <span>Total</span>
            <CurrencyDisplay amount={order.total} size="lg" />
          </div>
        </CardBody>
      </Card>

      <div className="mt-4 space-y-2">
        {nextOptions.map((status) => (
          <Button
            key={status}
            variant="secondary"
            className="w-full"
            onClick={() => handleStatusChange(status)}
            isLoading={updateStatus.isPending}
          >
            Mark as {ORDER_STATUS_LABELS[status]}
          </Button>
        ))}

        {!isPaid && (
          <Link href={`/pos/order/${order._id}/pay`}>
            <Button className="w-full" size="lg">
              Take payment
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}



