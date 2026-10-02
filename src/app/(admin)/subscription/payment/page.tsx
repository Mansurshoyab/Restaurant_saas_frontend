'use client';

import { useRouter } from 'next/navigation';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { SubmitPaymentForm } from '@/components/subscription/SubmitPaymentForm';

export default function SubmitSubscriptionPaymentPage() {
  const router = useRouter();

  return (
    <div className="max-w-lg">
      <PageHeader title="Renew subscription" description="Pay manually via bKash, then submit your transaction ID." />
      <Card>
        <CardBody className="py-6">
          <SubmitPaymentForm onSuccess={() => router.push('/subscription/payment/history')} />
        </CardBody>
      </Card>
    </div>
  );
}


