'use client';

import { TableTile } from './TableTile';
import { EmptyState } from '@/components/shared/EmptyState';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { LayoutGrid } from 'lucide-react';
import type { Table } from '@/lib/api/tables.api';

export function TableGrid({
  tables,
  isLoading,
  onSelect,
}: {
  tables: Table[] | undefined;
  isLoading: boolean;
  onSelect: (table: Table) => void;
}) {
  if (isLoading) return <LoadingSpinner label="Loading tables…" />;
  if (!tables?.length) {
    return <EmptyState icon={LayoutGrid} title="No tables yet" description="Add tables under Restaurant → Tables." />;
  }

  return (
    <div className="grid grid-cols-4 gap-3 sm:grid-cols-6">
      {tables.map((t) => (
        <TableTile key={t._id} table={t} onSelect={() => onSelect(t)} />
      ))}
    </div>
  );
}


