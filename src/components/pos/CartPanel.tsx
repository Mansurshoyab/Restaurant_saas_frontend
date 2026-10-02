'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCartStore } from '@/lib/stores/cartStore';
import { useCreateOrder } from '@/lib/hooks/useOrders';
import { CartLineItem } from './CartLineItem';
import { Button } from '@/components/ui/Button';
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';
import { normalizeApiError } from '@/lib/api/client';

export function CartPanel() {
  const router = useRouter();
  const { lines, orderType, tableId, subtotal, clearCart } = useCartStore();
  const createOrder = useCreateOrder();
  const [sending, setSending] = useState(false);

  const total = subtotal(); // tax computed server-side once the order is created

  const handleSendToKitchen = async () => {
    if (!orderType || lines.length === 0) return;
    setSending(true);
    try {
      const order = await createOrder.mutateAsync({
        orderType,
        tableId: tableId ?? undefined,
        items: lines.map((l) => ({ productId: l.productId, quantity: l.quantity, modifierIds: l.modifierIds })),
      });
      await import('@/lib/api/orders.api').then(({ ordersApi }) => ordersApi.confirm(order._id));
      clearCart();
      toast.success(`Order ${order.orderNumber} sent to kitchen`);
      router.push(`/pos/order/${order._id}`);
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    } finally {
      setSending(false);
    }
  };

  const handlePayNow = async () => {
    if (!orderType || lines.length === 0) return;
    setSending(true);
    try {
      const order = await createOrder.mutateAsync({
        orderType,
        tableId: tableId ?? undefined,
        items: lines.map((l) => ({ productId: l.productId, quantity: l.quantity, modifierIds: l.modifierIds })),
      });
      await import('@/lib/api/orders.api').then(({ ordersApi }) => ordersApi.confirm(order._id));
      clearCart();
      toast.success(`Order ${order.orderNumber} created`);
      router.push(`/pos/order/${order._id}/pay`);
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-full flex-col border-l border-slate-200 bg-white">
      <div className="border-b border-slate-100 px-4 py-3">
        <h2 className="text-sm font-semibold text-ink">Current order</h2>
      </div>

      <div className="flex-1 divide-y divide-slate-100 overflow-y-auto px-4">
        {lines.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink-muted">Tap a product to add it here.</p>
        ) : (
          lines.map((line) => <CartLineItem key={line.localId} line={line} />)
        )}
      </div>

      <div className="border-t border-slate-100 px-4 py-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-sm font-medium text-ink-muted">Subtotal</span>
          <CurrencyDisplay amount={total} size="lg" />
        </div>
        <div className="flex gap-2">
          <Button
            className="flex-1"
            size="lg"
            variant="secondary"
            disabled={lines.length === 0 || !orderType}
            isLoading={sending}
            onClick={handleSendToKitchen}
          >
            Send to kitchen
          </Button>
          <Button
            className="flex-1"
            size="lg"
            disabled={lines.length === 0 || !orderType}
            isLoading={sending}
            onClick={handlePayNow}
          >
            Pay Now
          </Button>
        </div>
      </div>
    </div>
  );
}


