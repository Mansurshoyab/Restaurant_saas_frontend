'use client';

import Link from 'next/link';
import { Card, CardBody } from '@/components/ui/Card';
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';
import { PageHeader } from '@/components/layout/PageHeader';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { usePlatformStats } from '@/lib/hooks/usePlatform';
import { AlertCircle } from 'lucide-react';

export default function PlatformDashboardPage() {
  const { data: stats, isLoading, error } = usePlatformStats();

  if (isLoading) return <LoadingSpinner className="mt-20" />;
  if (error) return <div className="text-danger">Failed to load stats.</div>;
  if (!stats) return null;

  return (
    <div className="space-y-6">
      <PageHeader title="Platform Dashboard" />

      {stats.expiringSubscriptions > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-orange-200 bg-orange-50 p-4 text-orange-900">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <div className="flex-1 text-sm">
            <span className="font-semibold">{stats.expiringSubscriptions} subscriptions</span> expiring within 7 days.
          </div>
          <Link
            href="/platform/subscriptions/requests"
            className="text-sm font-semibold text-orange-700 hover:underline"
          >
            Review requests
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 gap-6">
        <Card>
          <CardBody className="py-6">
            <h3 className="mb-4 text-sm font-medium text-ink-muted">Organizations</h3>
            <div className="flex items-baseline gap-4">
              <span className="text-4xl font-bold tabular-nums text-ink">{stats.organizations.total}</span>
              <span className="text-sm text-ink-muted">Total</span>
            </div>
            <div className="mt-4 flex gap-6 text-sm">
              <div>
                <span className="font-medium text-success">{stats.organizations.active}</span>
                <span className="ml-1 text-ink-muted">Active</span>
              </div>
              <div>
                <span className="font-medium text-danger">{stats.organizations.suspended}</span>
                <span className="ml-1 text-ink-muted">Suspended</span>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card>
          <CardBody className="py-6">
            <h3 className="mb-4 text-sm font-medium text-ink-muted">Revenue (Last 30 Days)</h3>
            <CurrencyDisplay amount={stats.revenue.last30Days} size="xl" />
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
