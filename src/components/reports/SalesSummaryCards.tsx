'use client';

import { Card, CardBody } from '@/components/ui/Card';
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';

interface SalesSummary {
  netSales: number;
  orderCount: number;
  averageOrderValue: number;
  grossSales: number;
}

export function SalesSummaryCards({ data }: { data: SalesSummary }) {
  const items = [
    { label: "Today's sales", value: <CurrencyDisplay amount={data.netSales} size="xl" /> },
    { label: 'Orders', value: <span className="tabular text-3xl font-bold">{data.orderCount}</span> },
    { label: 'Avg order value', value: <CurrencyDisplay amount={data.averageOrderValue} size="xl" /> },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardBody className="py-5">
            <p className="mb-1 text-sm text-ink-muted">{item.label}</p>
            {item.value}
          </CardBody>
        </Card>
      ))}
    </div>
  );
}


