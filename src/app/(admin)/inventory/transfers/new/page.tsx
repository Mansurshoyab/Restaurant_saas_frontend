'use client';

import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { TransferForm } from '@/components/inventory/TransferForm';

export default function NewTransferPage() {
  const router = useRouter();
  return (
    <div className="max-w-md">
      <PageHeader title="Transfer stock" description="Move inventory between branches." />
      <Card>
        <CardBody>
          <TransferForm onDone={() => router.push('/inventory/stock')} />
        </CardBody>
      </Card>
    </div>
  );
}


