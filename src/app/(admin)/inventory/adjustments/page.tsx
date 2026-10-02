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

export default function AdjustmentsListPage() {
  const { data: transactions, isLoading } = useStockTransactions({ type: STOCK_TX_TYPE.STOCK_ADJUSTMENT });

  return (
    <div>
      <PageHeader
        title="Stock adjustments"
        description="History of physical count corrections."
        action={
          <Link href="/inventory/adjustments/new">
            <Button>
              <Plus className="h-4 w-4" /> New adjustment
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
              emptyMessage="No adjustments recorded yet."
              columns={[
                { header: 'Item', accessor: (t: any) => t.inventoryItemId.name },
                {
                  header: 'Change',
                  accessor: (t: any) => (
                    <span className={t.quantity >= 0 ? 'text-success' : 'text-danger'}>
                      {t.quantity >= 0 ? '+' : ''}
                      {t.quantity} {t.inventoryItemId.unit}
                    </span>
                  ),
                },
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

