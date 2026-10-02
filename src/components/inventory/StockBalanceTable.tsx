'use client';

import { AlertTriangle } from 'lucide-react';
import { DataTable } from '@/components/shared/DataTable';
import type { StockBalance } from '@/types/inventory.types';

export function StockBalanceTable({ balances }: { balances: StockBalance[] }) {
  return (
    <DataTable
      data={balances as any}
      emptyMessage="No stock balances yet."
      columns={[
        {
          header: 'Item',
          accessor: (b: any) => (
            <span className="flex items-center gap-1.5">
              {b.reorderLevel > 0 && b.quantity <= b.reorderLevel && <AlertTriangle className="h-3.5 w-3.5 text-warning" />}
              {b.inventoryItemId.name}
            </span>
          ),
        },
        { header: 'Quantity', accessor: (b: any) => `${b.quantity} ${b.inventoryItemId.unit}` },
        { header: 'Reorder level', accessor: (b: any) => b.reorderLevel || '—' },
      ]}
    />
  );
}


