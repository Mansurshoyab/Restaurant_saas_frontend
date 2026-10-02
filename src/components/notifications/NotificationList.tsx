'use client';

import { cn } from '@/lib/utils/cn';
import { formatRelative } from '@/lib/utils/date';
import type { AppNotification } from '@/lib/api/notifications.api';

export function NotificationList({
  notifications,
  onSelect,
}: {
  notifications: AppNotification[] | undefined;
  onSelect: (id: string) => void;
}) {
  if (!notifications?.length) {
    return <p className="px-4 py-6 text-center text-sm text-ink-muted">No notifications yet.</p>;
  }

  return (
    <div className="max-h-80 overflow-y-auto">
      {notifications.map((n) => (
        <button
          key={n._id}
          onClick={() => onSelect(n._id)}
          className={cn(
            'block w-full border-b border-slate-50 px-4 py-3 text-left last:border-0 hover:bg-slate-50',
            !n.isRead && 'bg-brand-light/40'
          )}
        >
          <p className="text-sm font-medium text-ink">{n.title}</p>
          <p className="mt-0.5 text-xs text-ink-muted">{n.message}</p>
          <p className="mt-1 text-[11px] text-ink-faint">{formatRelative(n.createdAt)}</p>
        </button>
      ))}
    </div>
  );
}


