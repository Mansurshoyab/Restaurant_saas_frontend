'use client';

import { useQuery } from '@tanstack/react-query';
import { settingsApi } from '@/lib/api/settings.api';
import { formatDateTime } from '@/lib/utils/date';
import { formatCurrency } from '@/lib/utils/currency';
import type { Order } from '@/types/order.types';

export function OrderReceiptPreview({ order }: { order: Order }) {
  const { data: settings } = useQuery({ queryKey: ['settings'], queryFn: settingsApi.get });

  return (
    <div className="mx-auto w-full max-w-xs rounded-md border border-slate-200 bg-white p-4 font-mono text-xs">
      {settings?.receiptHeader && <p className="mb-2 text-center font-semibold">{settings.receiptHeader}</p>}
      <p className="text-center text-ink-muted">{formatDateTime(order.createdAt)}</p>
      <p className="mb-3 text-center text-ink-muted">Order {order.orderNumber}</p>

      <div className="space-y-1 border-y border-dashed border-slate-300 py-2">
        {order.items.map((item) => (
          <div key={item._id} className="flex justify-between">
            <span>
              {item.quantity}× {item.productName}
            </span>
            <span>{formatCurrency(item.subtotal)}</span>
          </div>
        ))}
      </div>

      <div className="mt-2 space-y-1">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatCurrency(order.subtotal)}</span>
        </div>
        {order.discount > 0 && (
          <div className="flex justify-between">
            <span>Discount</span>
            <span>-{formatCurrency(order.discount)}</span>
          </div>
        )}
        <div className="flex justify-between">
          <span>Tax</span>
          <span>{formatCurrency(order.tax)}</span>
        </div>
        <div className="flex justify-between border-t border-slate-300 pt-1 font-semibold">
          <span>Total</span>
          <span>{formatCurrency(order.total)}</span>
        </div>
      </div>

      {settings?.receiptFooter && <p className="mt-3 text-center text-ink-muted">{settings.receiptFooter}</p>}
    </div>
  );
}


