'use client';

import { useState } from 'react';
import { useWasteReport } from '@/lib/hooks/useReports';
import { PageHeader } from '@/components/layout/PageHeader';
import { ReportsSubNav } from '@/components/reports/ReportsSubNav';
import { Card, CardBody } from '@/components/ui/Card';
import { DataTable } from '@/components/shared/DataTable';
import { DateRangePicker } from '@/components/reports/DateRangePicker';
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';

export default function WasteReportPage() {
  const [range, setRange] = useState<{ from?: string; to?: string }>({});
  const { data, isLoading } = useWasteReport(range);

  return (
    <div>
      <PageHeader
        title="Waste report"
        action={<DateRangePicker onChange={setRange} />}
      />

      <ReportsSubNav />

      <Card>
        <CardBody>
          {isLoading ? (
            <p className="text-sm text-ink-muted">Loading…</p>
          ) : (
            <DataTable
              data={data?.map((d: any) => ({
                ...d,
                _id: d.inventoryItemId,
              }))}
              emptyMessage="No waste recorded in this period."
              columns={[
                {
                  header: 'Item',
                  accessor: (d: any) => d.itemName,
                },
                {
                  header: 'Quantity wasted',
                  accessor: (d: any) => `${d.totalWasted} ${d.unit}`,
                },
                {
                  header: 'Estimated value',
                  accessor: (d: any) => (
                    <CurrencyDisplay
                      amount={d.estimatedValue}
                      size="sm"
                    />
                  ),
                },
                {
                  header: 'Occurrences',
                  accessor: (d: any) => d.occurrences,
                },
              ]}
            />
          )}
        </CardBody>
      </Card>
    </div>
  );
}


