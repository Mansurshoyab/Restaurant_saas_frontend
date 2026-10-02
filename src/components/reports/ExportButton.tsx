'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';

function toCsv(rows: Record<string, unknown>[]): string {
  if (!rows.length) return '';
  const headers = Object.keys(rows[0]);
  const lines = [
    headers.join(','),
    ...rows.map((row) => headers.map((h) => JSON.stringify(row[h] ?? '')).join(',')),
  ];
  return lines.join('\n');
}

export function ExportButton({ data, filename }: { data: Record<string, unknown>[]; filename: string }) {
  const handleExport = () => {
    const csv = toCsv(data);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button variant="secondary" size="sm" onClick={handleExport} disabled={!data.length}>
      <Download className="h-3.5 w-3.5" /> Export CSV
    </Button>
  );
}


