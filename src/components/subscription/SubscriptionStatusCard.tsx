import { differenceInCalendarDays, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/Badge';
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';
import { formatDate } from '@/lib/utils/date';
import type { Subscription } from '@/types/subscription.types';

const STATUS_VARIANT: Record<string, 'default' | 'success' | 'danger' | 'warning' | 'brand'> = {
  TRIAL: 'brand',
  ACTIVE: 'success',
  EXPIRED: 'danger',
  SUSPENDED: 'danger',
  CANCELLED: 'default',
};

export function SubscriptionStatusCard({ subscription }: { subscription: Subscription }) {
  const daysLeft = differenceInCalendarDays(parseISO(subscription.endDate), new Date());

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-sm text-ink-muted">Status</span>
        <Badge variant={STATUS_VARIANT[subscription.status]}>{subscription.status}</Badge>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-ink-muted">Amount</span>
        <CurrencyDisplay amount={subscription.amount} size="sm" />
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm text-ink-muted">{daysLeft >= 0 ? 'Renews / expires' : 'Expired on'}</span>
        <span className="text-sm text-ink">{formatDate(subscription.endDate)}</span>
      </div>
      {daysLeft >= 0 && daysLeft <= 7 && subscription.status !== 'EXPIRED' && (
        <p className="text-sm text-warning">{daysLeft} day{daysLeft === 1 ? '' : 's'} remaining</p>
      )}
    </div>
  );
}


