'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useOrder } from '@/lib/hooks/useOrders';
import { usePayOrder } from '@/lib/hooks/usePayment';
import { SplitPaymentForm } from '@/components/pos/SplitPaymentForm';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';
import { normalizeApiError } from '@/lib/api/client';
import type { PaymentLineInput } from '@/types/payment.types';

export default function PayOrderPage({ params }: { params: { orderId: string } }) {
  const router = useRouter();
  const { data: order, isLoading } = useOrder(params.orderId);
  const payOrder = usePayOrder();

  const handlePay = async (payments: PaymentLineInput[]) => {
    try {
      await payOrder.mutateAsync({ orderId: params.orderId, payments });
      toast.success('Payment recorded');
      router.push('/pos/tables');
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    }
  };

  if (isLoading || !order) return <p className="p-6 text-sm text-ink-muted">Loading order…</p>;

  return (
    <div className="flex h-full items-start justify-center overflow-y-auto p-6">
      <div className="w-full max-w-md space-y-4">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <span className="font-medium text-ink">Order {order.orderNumber}</span>
            <span className="text-sm text-ink-muted">{order.items.length} items</span>
          </CardHeader>
          <CardBody className="space-y-1.5 text-sm">
            <div className="flex justify-between text-ink-muted">
              <span>Subtotal</span>
              <CurrencyDisplay amount={order.subtotal} size="sm" />
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-ink-muted">
                <span>Discount</span>
                <span className="tabular text-danger">-{order.discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-ink-muted">
              <span>Tax</span>
              <CurrencyDisplay amount={order.tax} size="sm" />
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="py-5">
            <SplitPaymentForm orderTotal={order.total} onSubmit={handlePay} isSubmitting={payOrder.isPending} />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}


