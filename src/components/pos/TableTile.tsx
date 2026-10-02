'use client';

import { cn } from '@/lib/utils/cn';
import type { Table } from '@/lib/api/tables.api';

const statusStyles: Record<Table['status'], string> = {
  AVAILABLE: 'border-slate-200 bg-white hover:border-brand',
  OCCUPIED: 'border-warning bg-warning-light',
  RESERVED: 'border-ink-faint bg-slate-100',
};

export function TableTile({ table, onSelect }: { table: Table; onSelect: () => void }) {
  return (
    <button
      onClick={onSelect}
      disabled={table.status === 'RESERVED'}
      className={cn(
        'flex aspect-square flex-col items-center justify-center rounded-lg border-2 text-center transition disabled:cursor-not-allowed disabled:opacity-60',
        statusStyles[table.status]
      )}
    >
      <span className="text-lg font-semibold text-ink">{table.label}</span>
      <span className="text-xs text-ink-muted">{table.seats} seats</span>
    </button>
  );
}


