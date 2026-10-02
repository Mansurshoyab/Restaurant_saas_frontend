'use client';

import { useMemo } from 'react';
import { usePurchaseOrders } from '@/lib/hooks/usePurchases';
import { PageHeader } from '@/components/layout/PageHeader';
import { ReportsSubNav } from '@/components/reports/ReportsSubNav';
import { Card, CardBody } from '@/components/ui/Card';
import { DataTable } from '@/components/shared/DataTable';
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import type { SupplierSpendRow } from '@/types/report.types';

export default function PurchasingReportPage() {
  const { data: purchaseOrders, isLoading } = usePurchaseOrders();

  // No dedicated /reports/purchases backend endpoint exists — this
  // aggregates client-side from GET /purchases instead of pretending
  // to call a route that isn't there.
  const bySupplier = useMemo<SupplierSpendRow[]>(() => {
    if (!purchaseOrders) return [];
    const map = new Map<string, SupplierSpendRow>();

    for (const po of purchaseOrders) {
      const supplierId =
        typeof po.supplierId === 'string'
          ? po.supplierId
          : po.supplierId._id;

      const supplierName =
        typeof po.supplierId === 'string'
          ? po.supplierId
          : po.supplierId.name;

      const existing =
        map.get(supplierId) ?? {
          supplierId,
          supplierName,
          totalSpend: 0,
          purchaseOrderCount: 0,
        };

      existing.totalSpend += po.totalAmount;
      existing.purchaseOrderCount += 1;
      map.set(supplierId, existing);
    }

    return Array.from(map.values()).sort(
      (a, b) => b.totalSpend - a.totalSpend
    );
  }, [purchaseOrders]);

  const grandTotal = bySupplier.reduce(
    (sum, s) => sum + s.totalSpend,
    0
  );

  return (
    <div>
      <PageHeader
        title="Purchasing report"
        description="Spend by supplier, based on all purchase orders."
      />

      <ReportsSubNav />

      <Card>
        <CardBody>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <>
              <DataTable
                data={bySupplier.map((s) => ({
                  ...s,
                  _id: s.supplierId,
                }))}
                emptyMessage="No purchase orders yet."
                columns={[
                  {
                    header: 'Supplier',
                    accessor: (s: any) => s.supplierName,
                  },
                  {
                    header: 'Purchase orders',
                    accessor: (s: any) => s.purchaseOrderCount,
                  },
                  {
                    header: 'Total spend',
                    accessor: (s: any) => (
                      <CurrencyDisplay
                        amount={s.totalSpend}
                        size="sm"
                      />
                    ),
                  },
                ]}
              />

              <div className="mt-3 flex justify-between border-t border-slate-100 pt-3 text-sm font-medium">
                <span>Total spend across all suppliers</span>
                <CurrencyDisplay amount={grandTotal} size="lg" />
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

