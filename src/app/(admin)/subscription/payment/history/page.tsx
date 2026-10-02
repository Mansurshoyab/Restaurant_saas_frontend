'use client';

import { useMyPaymentRequests } from '@/lib/hooks/useSubscription';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { DataTable } from '@/components/shared/DataTable';
import { PaymentRequestStatusBadge } from '@/components/subscription/PaymentRequestStatusBadge';
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';
import { formatDateTime } from '@/lib/utils/date';

export default function PaymentHistoryPage() {
  const { data: requests, isLoading } = useMyPaymentRequests();

  return (
    <div className="max-w-2xl">
      <PageHeader title="Payment history" />
      <Card>
        <CardBody>
          {isLoading ? (
            <p className="text-sm text-ink-muted">Loading…</p>
          ) : (
            <DataTable
              data={requests}
              emptyMessage="No payment requests submitted yet."
              columns={[
                { header: 'Date', accessor: (r) => formatDateTime(r.createdAt) },
                { header: 'Amount', accessor: (r) => <CurrencyDisplay amount={r.amount} size="sm" /> },
                { header: 'Transaction ID', accessor: (r) => r.transactionId },
                { header: 'Status', accessor: (r) => <PaymentRequestStatusBadge status={r.status} /> },
              ]}
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
}


