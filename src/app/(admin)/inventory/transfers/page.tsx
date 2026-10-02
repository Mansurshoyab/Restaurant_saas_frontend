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

export default function TransfersListPage() {
  const { data: transfersOut, isLoading } = useStockTransactions({ type: STOCK_TX_TYPE.TRANSFER_OUT });

  return (
    <div>
      <PageHeader
        title="Stock transfers"
        description="Transfers out of this branch. Check the destination branch for the matching transfer in."
        action={
          <Link href="/inventory/transfers/new">
            <Button>
              <Plus className="h-4 w-4" /> New transfer
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
              data={transfersOut as any}
              emptyMessage="No transfers yet."
              columns={[
                { header: 'Item', accessor: (t: any) => t.inventoryItemId.name },
                { header: 'Quantity', accessor: (t: any) => `${Math.abs(t.quantity)} ${t.inventoryItemId.unit}` },
                { header: 'Reference', accessor: (t: any) => t.reference ?? '—' },
                { header: 'Date', accessor: (t: any) => formatDateTime(t.createdAt) },
              ]}
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
}


