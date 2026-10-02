'use client';

import { useState } from 'react';
import { usePaymentReport } from '@/lib/hooks/useReports';
import { PageHeader } from '@/components/layout/PageHeader';
import { ReportsSubNav } from '@/components/reports/ReportsSubNav';
import { Card, CardBody } from '@/components/ui/Card';
import { PaymentMethodPieChart } from '@/components/reports/PaymentMethodPieChart';
import { DateRangePicker } from '@/components/reports/DateRangePicker';
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';

export default function PaymentsReportPage() {
  const [range, setRange] = useState<{ from?: string; to?: string }>({});
  const { data, isLoading } = usePaymentReport(range);

  return (
    <div>
      <PageHeader
        title="Payments report"
        action={<DateRangePicker onChange={setRange} />}
      />

      <ReportsSubNav />

      <Card>
        <CardBody>
          {isLoading || !data ? (
            <p className="text-sm text-ink-muted">Loading…</p>
          ) : (
            <div className="grid grid-cols-2 gap-6">
              <PaymentMethodPieChart data={data.byMethod} />

              <div className="space-y-2">
                {data.byMethod.map((m: any) => (
                  <div
                    key={m.method}
                    className="flex justify-between border-b border-slate-100 py-2 text-sm"
                  >
                    <span>{m.method}</span>
                    <CurrencyDisplay amount={m.total} size="sm" />
                  </div>
                ))}

                <div className="flex justify-between pt-2 font-medium">
                  <span>Total</span>
                  <CurrencyDisplay amount={data.grandTotal} />
                </div>
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

