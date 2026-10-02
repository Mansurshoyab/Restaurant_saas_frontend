'use client';

import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { AdjustmentForm } from '@/components/inventory/AdjustmentForm';

export default function NewAdjustmentPage() {
  const router = useRouter();
  return (
    <div className="max-w-md">
      <PageHeader title="Stock adjustment" description="Correct stock to match a physical count." />
      <Card>
        <CardBody>
          <AdjustmentForm onDone={() => router.push('/inventory/stock')} />
        </CardBody>
      </Card>
    </div>
  );
}


