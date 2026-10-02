'use client';

import Link from 'next/link';
import { AlertTriangle } from 'lucide-react';
import { useMySubscription } from '@/lib/hooks/useSubscription';
import { differenceInCalendarDays, parseISO } from 'date-fns';

export function SubscriptionLockedBanner() {
  const { data: subscription } = useMySubscription();

  if (!subscription) return null;

  const daysLeft = differenceInCalendarDays(parseISO(subscription.endDate), new Date());
  const isExpired = subscription.status === 'EXPIRED' || subscription.status === 'SUSPENDED';
  const isExpiringSoon = daysLeft <= 7 && daysLeft >= 0 && subscription.status !== 'EXPIRED';

  if (!isExpired && !isExpiringSoon) return null;

  return (
    <div
      className={
        isExpired
          ? 'flex items-center justify-between bg-danger px-4 py-2 text-sm text-white'
          : 'flex items-center justify-between bg-warning px-4 py-2 text-sm text-white'
      }
    >
      <span className="flex items-center gap-2">
        <AlertTriangle className="h-4 w-4" />
        {isExpired
          ? 'Your subscription has expired. New orders and payments are blocked.'
          : `Your subscription expires in ${daysLeft} day${daysLeft === 1 ? '' : 's'}.`}
      </span>
      <Link href="/subscription/payment" className="font-medium underline underline-offset-2">
        Renew now
      </Link>
    </div>
  );
}


