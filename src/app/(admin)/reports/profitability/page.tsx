'use client';

import { useState } from 'react';
import { useProfitabilityReport } from '@/lib/hooks/useReports';
import { PageHeader } from '@/components/layout/PageHeader';
import { ReportsSubNav } from '@/components/reports/ReportsSubNav';
import { Card, CardBody } from '@/components/ui/Card';
import { ProfitabilityBreakdown } from '@/components/reports/ProfitabilityBreakdown';
import { DateRangePicker } from '@/components/reports/DateRangePicker';

export default function ProfitabilityReportPage() {
  const [range, setRange] = useState<{ from?: string; to?: string }>({});
  const { data, isLoading } = useProfitabilityReport(range);

  return (
    <div className="max-w-lg">
      <PageHeader
        title="Profitability"
        action={<DateRangePicker onChange={setRange} />}
      />

      <ReportsSubNav />

      <Card>
        <CardBody>
          {isLoading || !data ? (
            <p className="text-sm text-ink-muted">Loading…</p>
          ) : (
            <ProfitabilityBreakdown data={data} />
          )}
        </CardBody>
      </Card>
    </div>
  );
}

