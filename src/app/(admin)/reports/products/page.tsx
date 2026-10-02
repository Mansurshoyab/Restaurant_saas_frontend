'use client';

import { useState } from 'react';
import { useTopProducts } from '@/lib/hooks/useReports';
import { PageHeader } from '@/components/layout/PageHeader';
import { ReportsSubNav } from '@/components/reports/ReportsSubNav';
import { Card, CardBody } from '@/components/ui/Card';
import { TopProductsTable } from '@/components/reports/TopProductsTable';
import { Button } from '@/components/ui/Button';
import { ExportButton } from '@/components/reports/ExportButton';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function ProductsReportPage() {
  const [sortBy, setSortBy] = useState<'quantity' | 'revenue'>('quantity');
  const { data: products, isLoading } = useTopProducts({ sortBy, limit: 20 });

  return (
    <div>
      <PageHeader
        title="Product performance"
        action={
          <div className="flex gap-2">
            <Button
              variant={sortBy === 'quantity' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSortBy('quantity')}
            >
              By quantity
            </Button>

            <Button
              variant={sortBy === 'revenue' ? 'primary' : 'secondary'}
              size="sm"
              onClick={() => setSortBy('revenue')}
            >
              By revenue
            </Button>

            <ExportButton
              data={products ?? []}
              filename="product-performance"
            />
          </div>
        }
      />

      <ReportsSubNav />

      <Card>
        <CardBody>
          {isLoading ? (
            <LoadingSpinner />
          ) : (
            <TopProductsTable data={products} />
          )}
        </CardBody>
      </Card>
    </div>
  );
}

