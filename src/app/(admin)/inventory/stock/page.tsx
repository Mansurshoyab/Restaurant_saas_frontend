'use client';

import { useState } from 'react';
import { useStockBalances } from '@/lib/hooks/useStock';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StockBalanceTable } from '@/components/inventory/StockBalanceTable';
import { cn } from '@/lib/utils/cn';

export default function StockPage() {
  const [lowStockOnly, setLowStockOnly] = useState(false);
  const { data: balances, isLoading } = useStockBalances(lowStockOnly);

  return (
    <div>
      <PageHeader
        title="Current stock"
        action={
          <Button variant={lowStockOnly ? 'primary' : 'secondary'} onClick={() => setLowStockOnly((v) => !v)}>
            Low stock only
          </Button>
        }
      />
      <Card>
        <CardBody>{isLoading ? <p className="text-sm text-ink-muted">Loading…</p> : <StockBalanceTable balances={(balances as any) ?? []} />}</CardBody>
      </Card>
    </div>
  );
}


