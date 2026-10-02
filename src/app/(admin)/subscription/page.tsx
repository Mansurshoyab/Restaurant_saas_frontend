'use client';

import Link from 'next/link';
import { useMySubscription } from '@/lib/hooks/useSubscription';
import { PageHeader } from '@/components/layout/PageHeader';
import { Card, CardBody } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { SubscriptionStatusCard } from '@/components/subscription/SubscriptionStatusCard';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';

export default function SubscriptionPage() {
  const { data: subscription, isLoading } = useMySubscription();

  return (
    <div className="max-w-lg">
      <PageHeader title="Subscription" />

      {isLoading ? (
        <LoadingSpinner />
      ) : !subscription ? (
        <Card>
          <CardBody className="py-8 text-center">
            <p className="mb-4 text-sm text-ink-muted">No active subscription.</p>
            <Link href="/subscription/payment">
              <Button>Choose a plan</Button>
            </Link>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardBody className="space-y-4 py-6">
            <SubscriptionStatusCard subscription={subscription} />
            <Link href="/subscription/payment">
              <Button variant="secondary" className="w-full">
                Renew or upgrade
              </Button>
            </Link>
            <Link href="/subscription/payment/history" className="block text-center text-sm text-brand hover:text-brand-hover">
              View payment history
            </Link>
          </CardBody>
        </Card>
      )}
    </div>
  );
}


