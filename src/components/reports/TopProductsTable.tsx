import { DataTable } from '@/components/shared/DataTable';
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';
import type { TopProductRow } from '@/types/report.types';

export function TopProductsTable({ data }: { data: TopProductRow[] | undefined }) {
  return (
    <DataTable
      data={data?.map((p) => ({ ...p, _id: p.productId }))}
      emptyMessage="No sales data yet."
      columns={[
        { header: 'Product', accessor: (p: any) => p.productName },
        { header: 'Quantity sold', accessor: (p: any) => p.quantitySold },
        { header: 'Revenue', accessor: (p: any) => <CurrencyDisplay amount={p.revenue} size="sm" /> },
      ]}
    />
  );
}


