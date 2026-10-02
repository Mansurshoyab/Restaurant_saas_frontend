'use client';

import { useState } from 'react';
import { useSalesReport, useSalesTimeseries } from '@/lib/hooks/useReports';
import { PageHeader } from '@/components/layout/PageHeader';
import { ReportsSubNav } from '@/components/reports/ReportsSubNav';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { SalesSummaryCards } from '@/components/reports/SalesSummaryCards';
import { SalesTimeseriesChart } from '@/components/reports/SalesTimeseriesChart';
import { DateRangePicker } from '@/components/reports/DateRangePicker';

export default function SalesReportPage() {
  const [range, setRange] = useState<{ from?: string; to?: string }>({});
  const { data: sales, isLoading } = useSalesReport(range);
  const { data: timeseries } = useSalesTimeseries({
    ...range,
    granularity: 'day',
  });

  return (
    <div>
      <PageHeader
        title="Sales report"
        action={<DateRangePicker onChange={setRange} />}
      />

      <ReportsSubNav />

      {isLoading || !sales ? (
        <p className="text-sm text-ink-muted">Loading…</p>
      ) : (
        <SalesSummaryCards data={sales} />
      )}

      <Card className="mt-4">
        <CardHeader>
          <h2 className="text-sm font-semibold text-ink">Trend</h2>
        </CardHeader>

        <CardBody>
          {timeseries?.length ? (
            <SalesTimeseriesChart data={timeseries} />
          ) : (
            <p className="text-sm text-ink-muted">No data.</p>
          )}
        </CardBody>
      </Card>
    </div>
  );
}


