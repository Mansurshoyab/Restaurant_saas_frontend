'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { purchasesApi } from '@/lib/api/purchases.api';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/shared/DataTable';
import { PurchaseOrderStatusBadge } from '@/components/purchases/PurchaseOrderStatusBadge';
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';
import { useRouter } from 'next/navigation';

export default function PurchaseOrdersPage() {
  const router = useRouter();
  const { data: orders } = useQuery({ queryKey: ['purchases'], queryFn: () => purchasesApi.list() });

  return (
    <div>
      <PageHeader
        title="Purchase orders"
        action={
          <Link href="/purchasing/orders/new">
            <Button>
              <Plus className="h-4 w-4" /> New purchase order
            </Button>
          </Link>
        }
      />
      <Card>
        <CardBody>
          <DataTable
            data={orders}
            onRowClick={(po) => router.push(`/purchasing/orders/${po._id}`)}
            emptyMessage="No purchase orders yet."
            columns={[
              { header: 'PO Number', accessor: (po) => po.poNumber },
              { header: 'Supplier', accessor: (po) => (typeof po.supplierId === 'string' ? po.supplierId : po.supplierId.name) },
              { header: 'Total', accessor: (po) => <CurrencyDisplay amount={po.totalAmount} size="sm" /> },
              { header: 'Status', accessor: (po) => <PurchaseOrderStatusBadge status={po.status} /> },
            ]}
          />
        </CardBody>
      </Card>
    </div>
  );
}



