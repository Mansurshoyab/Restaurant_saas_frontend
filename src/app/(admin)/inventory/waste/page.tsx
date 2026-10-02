'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { useStockTransactions } from '@/lib/hooks/useStock';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/shared/DataTable';
import { formatDateTime } from '@/lib/utils/date';
import { STOCK_TX_TYPE } from '@/lib/constants';

export default function WasteListPage() {
  const { data: transactions, isLoading } = useStockTransactions({ type: STOCK_TX_TYPE.WASTE });

  return (
    <div>
      <PageHeader
        title="Waste log"
        action={
          <Link href="/inventory/waste/new">
            <Button>
              <Plus className="h-4 w-4" /> Record waste
            </Button>
          </Link>
        }
      />
      <Card>
        <CardBody>
          {isLoading ? (
            <p className="text-sm text-ink-muted">Loading…</p>
          ) : (
            <DataTable
              data={transactions as any}
              emptyMessage="No waste recorded yet."
              columns={[
                { header: 'Item', accessor: (t: any) => t.inventoryItemId.name },
                { header: 'Quantity', accessor: (t: any) => `${Math.abs(t.quantity)} ${t.inventoryItemId.unit}` },
                { header: 'Reason', accessor: (t: any) => t.reason ?? '—' },
                { header: 'Date', accessor: (t: any) => formatDateTime(t.createdAt) },
              ]}
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
}


