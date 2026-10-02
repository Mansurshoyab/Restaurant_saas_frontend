'use client';

import { useRouter } from 'next/navigation';
import { useTables } from '@/lib/hooks/useTables';
import { useOrders } from '@/lib/hooks/useOrders';
import { useCartStore } from '@/lib/stores/cartStore';
import { TableGrid } from '@/components/pos/TableGrid';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/shared/DataTable';
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { formatDateTime } from '@/lib/utils/date';
import { ORDER_TYPE } from '@/lib/constants';

export default function TableSelectPage() {
  const router = useRouter();
  const { setOrderType, setTableId } = useCartStore();
  const { data: tables, isLoading } = useTables();
  const { data: orders, isLoading: ordersLoading } = useOrders();

  const startOrder = (type: keyof typeof ORDER_TYPE, tableId?: string) => {
    setOrderType(ORDER_TYPE[type]);
    setTableId(tableId ?? null);
    router.push('/pos');
  };

  return (
    <div className="mx-auto h-full max-w-4xl overflow-y-auto p-6">
      <h1 className="mb-4 text-lg font-semibold text-ink">Start an order</h1>

      <div className="mb-6 flex gap-3">
        <Button variant="secondary" size="lg" onClick={() => startOrder('TAKEAWAY')}>
          Takeaway
        </Button>
        <Button variant="secondary" size="lg" onClick={() => startOrder('DELIVERY')}>
          Delivery
        </Button>
      </div>

      <h2 className="mb-3 text-sm font-medium text-ink-muted">Or pick a table for dine-in</h2>
      <div className="mb-10">
        <TableGrid tables={tables} isLoading={isLoading} onSelect={(t) => startOrder('DINE_IN', t._id)} />
      </div>

      <h2 className="mb-3 text-sm font-medium text-ink-muted">Active Orders</h2>
      <div className="rounded-lg border border-slate-200 bg-white">
        {ordersLoading ? (
          <p className="p-6 text-center text-sm text-ink-muted">Loading orders…</p>
        ) : (
          <DataTable
            data={orders?.filter((o) => o.status !== 'COMPLETED' && o.status !== 'CANCELLED') || []}
            onRowClick={(o) => router.push(`/pos/order/${o._id}`)}
            emptyMessage="No active orders."
            columns={[
              { header: 'Order #', accessor: (o) => o.orderNumber },
              { header: 'Type', accessor: (o) => o.orderType },
              { header: 'Items', accessor: (o) => o.items.length },
              { header: 'Total', accessor: (o) => <CurrencyDisplay amount={o.total} size="sm" /> },
              { header: 'Status', accessor: (o) => <OrderStatusBadge status={o.status} /> },
              { header: 'Time', accessor: (o) => formatDateTime(o.createdAt) },
            ]}
          />
        )}
      </div>
    </div>
  );
}



