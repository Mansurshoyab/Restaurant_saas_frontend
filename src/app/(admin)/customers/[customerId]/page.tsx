'use client';

import { useCustomer } from '@/lib/hooks/useCustomers';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { formatDate } from '@/lib/utils/date';

export default function CustomerDetailPage({ params }: { params: { customerId: string } }) {
  const { data: customer, isLoading } = useCustomer(params.customerId);

  if (isLoading || !customer) return <LoadingSpinner />;

  return (
    <div className="max-w-md">
      <PageHeader title={customer.name ?? 'Customer'} />
      <Card>
        <CardBody className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-ink-muted">Phone</span>
            <span>{customer.phone ?? '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-muted">Address</span>
            <span>{customer.address ?? '—'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-muted">Customer since</span>
            <span>{formatDate(customer.createdAt)}</span>
          </div>
          {customer.notes && (
            <div className="border-t border-slate-100 pt-3">
              <p className="text-ink-muted">Notes</p>
              <p className="mt-1">{customer.notes}</p>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}


