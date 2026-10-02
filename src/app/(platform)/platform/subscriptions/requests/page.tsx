'use client';

import { useRouter } from 'next/navigation';
import { Card, CardBody } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/shared/DataTable';
import { PageHeader } from '@/components/layout/PageHeader';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';
import { usePendingSubscriptionRequests } from '@/lib/hooks/usePlatform';
import type { SubscriptionRequest } from '@/types/platform.types';
import Link from 'next/link';

export default function SubscriptionRequestsPage() {
  const router = useRouter();
  const { data: requests, isLoading } = usePendingSubscriptionRequests();

  const columns = [
    {
      header: 'Date',
      accessor: (row: SubscriptionRequest) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      header: 'Organization',
      accessor: (row: SubscriptionRequest) => {
        const org: any = row.organization || row.organizationId;
        const orgName = typeof org === 'object' && org !== null ? org.name : org;
        return <span className="font-medium text-ink">{orgName}</span>;
      },
    },
    {
      header: 'Plan',
      accessor: (row: SubscriptionRequest) => {
        const p: any = row.plan || row.planId;
        const planName = typeof p === 'object' && p !== null ? p.name : p;
        return <span className="text-ink-muted">{planName}</span>;
      },
    },
    {
      header: 'Amount',
      accessor: (row: SubscriptionRequest) => <CurrencyDisplay amount={row.amount} />,
    },
    {
      header: 'bKash No.',
      accessor: (row: SubscriptionRequest) => row.senderBkashNumber || '-',
    },
    {
      header: 'TrxID',
      accessor: (row: SubscriptionRequest) => row.transactionId || '-',
    },
    {
      header: 'Status',
      accessor: (row: SubscriptionRequest) => (
        <Badge variant={row.status === 'PENDING' ? 'warning' : 'default'}>{row.status}</Badge>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Subscription Requests"
        description="Pending manual payment verifications."
        action={
          <Link
            href="/platform/subscriptions/verify"
            className="text-sm font-medium text-brand hover:underline"
          >
            Manual verification form
          </Link>
        }
      />

      <Card>
        {isLoading ? (
          <LoadingSpinner className="py-20" />
        ) : (
          <DataTable
            columns={columns}
            data={requests}
            onRowClick={(row) => router.push(`/platform/subscriptions/requests/${row._id}`)}
            emptyMessage="No pending requests."
          />
        )}
      </Card>
    </div>
  );
}
