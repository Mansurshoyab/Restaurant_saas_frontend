'use client';

import { useInventoryValuation } from '@/lib/hooks/useReports';
import { PageHeader } from '@/components/layout/PageHeader';
import { ReportsSubNav } from '@/components/reports/ReportsSubNav';
import { Card, CardBody } from '@/components/ui/Card';
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';

export default function InventoryReportPage() {
  const { data, isLoading } = useInventoryValuation();

  return (
    <div>
      <PageHeader title="Inventory valuation" />

      <ReportsSubNav />

      <Card>
        <CardBody>
          {isLoading || !data ? (
            <p className="text-sm text-ink-muted">Loading…</p>
          ) : (
            <div className="space-y-2">
              {data.byCategory.map((c: any) => (
                <div
                  key={c.category}
                  className="flex justify-between border-b border-slate-100 py-2 text-sm"
                >
                  <span>{c.category}</span>
                  <CurrencyDisplay amount={c.value} size="sm" />
                </div>
              ))}

              <div className="flex justify-between pt-2 font-medium">
                <span>Total inventory value</span>
                <CurrencyDisplay amount={data.total} size="lg" />
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}