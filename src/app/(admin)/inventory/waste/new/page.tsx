'use client';

import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { WasteForm } from '@/components/inventory/WasteForm';

export default function NewWastePage() {
  const router = useRouter();
  return (
    <div className="max-w-md">
      <PageHeader title="Record waste" />
      <Card>
        <CardBody>
          <WasteForm onDone={() => router.push('/inventory/stock')} />
        </CardBody>
      </Card>
    </div>
  );
}


