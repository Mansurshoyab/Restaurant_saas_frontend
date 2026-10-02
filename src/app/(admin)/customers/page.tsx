'use client';

import { useState } from 'react';
import { useCustomers } from '@/lib/hooks/useCustomers';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { DataTable } from '@/components/shared/DataTable';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { formatDate } from '@/lib/utils/date';

export default function CustomersPage() {
  const [search, setSearch] = useState('');
  const { data: customers, isLoading } = useCustomers(search || undefined);

  return (
    <div>
      <PageHeader title="Customers" description="Captured from delivery and takeaway orders." />

      <div className="mb-4 max-w-xs">
        <Input placeholder="Search by name or phone" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>

      <Card>
        <CardBody>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <DataTable
              data={customers}
              emptyMessage="No customers captured yet."
              columns={[
                { header: 'Name', accessor: (c) => c.name ?? '—' },
                { header: 'Phone', accessor: (c) => c.phone ?? '—' },
                { header: 'Address', accessor: (c) => c.address ?? '—' },
                { header: 'Since', accessor: (c) => formatDate(c.createdAt) },
              ]}
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
}


