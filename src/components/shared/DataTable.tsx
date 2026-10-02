'use client';

import { cn } from '@/lib/utils/cn';

export interface Column<T> {
  header: string;
  accessor: (row: T) => React.ReactNode;
  className?: string;
}

export function DataTable<T extends { _id: string }>({
  columns,
  data,
  onRowClick,
  emptyMessage = 'Nothing here yet.',
}: {
  columns: Column<T>[];
  data: T[] | undefined;
  onRowClick?: (row: T) => void;
  emptyMessage?: string;
}) {
  if (!data?.length) {
    return <p className="py-10 text-center text-sm text-ink-muted">{emptyMessage}</p>;
  }

  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="border-b border-slate-100">
          {columns.map((col) => (
            <th key={col.header} className="px-3 py-2.5 font-medium text-ink-muted">
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr
            key={row._id}
            onClick={() => onRowClick?.(row)}
            className={cn('border-b border-slate-50 last:border-0', onRowClick && 'cursor-pointer hover:bg-slate-50')}
          >
            {columns.map((col) => (
              <td key={col.header} className={cn('px-3 py-3', col.className)}>
                {col.accessor(row)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}


