'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useOrders } from '@/lib/hooks/useOrders';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { DataTable } from '@/components/shared/DataTable';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';
import { DateRangePicker } from '@/components/reports/DateRangePicker';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { formatDateTime } from '@/lib/utils/date';
import { cn } from '@/lib/utils/cn';
import { ORDER_STATUS, type OrderStatus } from '@/lib/constants';

const FILTERS: { label: string; value: OrderStatus | undefined }[] = [
  { label: 'All', value: undefined },
  { label: 'Active', value: ORDER_STATUS.CONFIRMED },
  { label: 'Completed', value: ORDER_STATUS.COMPLETED },
  { label: 'Cancelled', value: ORDER_STATUS.CANCELLED },
];

export default function OrdersPage() {
  const router = useRouter();
  const [status, setStatus] = useState<OrderStatus | undefined>(undefined);
  const [range, setRange] = useState<{ from?: string; to?: string }>({});
  const { data: orders, isLoading, error } = useOrders({ status, ...range });

  return (
    <div>
      <PageHeader title="Orders" />

      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.label}
              onClick={() => setStatus(f.value)}
              className={cn(
                'rounded-full px-3.5 py-1.5 text-sm font-medium',
                status === f.value ? 'bg-ink text-white' : 'bg-slate-100 text-ink-muted hover:bg-slate-200'
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
        <DateRangePicker onChange={setRange} />
      </div>

      <Card>
        <CardBody>
          {isLoading ? (
            <LoadingSpinner label="Loading orders…" />
          ) : error ? (
            <p className="py-6 text-center text-sm text-danger">
              Failed to load orders: {(error as Error).message}
            </p>
          ) : (
            <DataTable
              data={orders}
              onRowClick={(o) => router.push(`/orders/${o._id}`)}
              emptyMessage="No orders match this filter."
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
        </CardBody>
      </Card>
    </div>
  );
}


