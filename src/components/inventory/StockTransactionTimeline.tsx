'use client';

import { cn } from '@/lib/utils/cn';
import { formatDateTime } from '@/lib/utils/date';
import type { StockTransaction } from '@/types/inventory.types';

const TYPE_COLORS: Record<string, string> = {
  PURCHASE: 'text-success',
  SALE_CONSUMPTION: 'text-ink-muted',
  WASTE: 'text-danger',
  STOCK_ADJUSTMENT: 'text-warning',
  TRANSFER_OUT: 'text-danger',
  TRANSFER_IN: 'text-success',
  OPENING_STOCK: 'text-ink-muted',
  RETURN: 'text-warning',
  PRODUCTION: 'text-ink-muted',
};

export function StockTransactionTimeline({ transactions, unit }: { transactions: StockTransaction[]; unit: string }) {
  if (!transactions.length) {
    return <p className="py-6 text-center text-sm text-ink-muted">No stock movement yet.</p>;
  }

  return (
    <div className="divide-y divide-slate-100">
      {transactions.map((tx) => (
        <div key={tx._id} className="flex items-center justify-between py-2.5 text-sm">
          <div>
            <p className="text-ink">{tx.type.replace('_', ' ')}</p>
            {tx.reference && <p className="text-xs text-ink-muted">{tx.reference}</p>}
            {tx.reason && <p className="text-xs text-ink-muted">{tx.reason}</p>}
          </div>
          <div className="text-right">
            <p className={cn('tabular font-medium', TYPE_COLORS[tx.type])}>
              {tx.quantity >= 0 ? '+' : ''}
              {tx.quantity} {unit}
            </p>
            <p className="text-xs text-ink-faint">{formatDateTime(tx.createdAt)}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

