'use client';

import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useSalesReport, useSalesTimeseries, useTopProducts } from '@/lib/hooks/useReports';
import { useStockBalances } from '@/lib/hooks/useStock';
import { todayRange } from '@/lib/utils/date';
import { SalesSummaryCards } from '@/components/reports/SalesSummaryCards';
import { SalesTimeseriesChart } from '@/components/reports/SalesTimeseriesChart';
import { LowStockList } from '@/components/inventory/LowStockBadge';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function DashboardPage() {
  const { from, to } = todayRange();
  const { data: sales, isLoading: salesLoading } = useSalesReport({ from, to });
  const { data: timeseries } = useSalesTimeseries({ granularity: 'day' });
  const { data: topProducts } = useTopProducts({ limit: 5 });
  const { data: lowStock } = useStockBalances(true);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        action={
          <Link href="/pos/tables">
            <Button size="lg">
              <ShoppingCart className="h-4 w-4" /> New order
            </Button>
          </Link>
        }
      />

      {salesLoading || !sales ? <LoadingSpinner /> : <SalesSummaryCards data={sales} />}

      <Card>
        <CardHeader>
          <h2 className="text-sm font-semibold text-ink">Sales, last 30 days</h2>
        </CardHeader>
        <CardBody>
          {timeseries?.length ? <SalesTimeseriesChart data={timeseries} /> : <p className="text-sm text-ink-muted">No sales yet.</p>}
        </CardBody>
      </Card>

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-ink">Top products</h2>
          </CardHeader>
          <CardBody className="divide-y divide-slate-100">
            {topProducts?.length ? (
              topProducts.map((p: any) => (
                <div key={p.productId} className="flex items-center justify-between py-2 text-sm">
                  <span className="text-ink">{p.productName}</span>
                  <span className="flex items-center gap-3">
                    <span className="tabular text-ink-muted">{p.quantitySold} sold</span>
                    <CurrencyDisplay amount={p.revenue} size="sm" />
                  </span>
                </div>
              ))
            ) : (
              <p className="py-2 text-sm text-ink-muted">No sales data yet.</p>
            )}
          </CardBody>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-sm font-semibold text-ink">Low stock</h2>
          </CardHeader>
          <CardBody>
            <LowStockList items={(lowStock as any) ?? []} />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}


