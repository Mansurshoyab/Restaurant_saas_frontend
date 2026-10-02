'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';
import { useNotifications, useMarkAllNotificationsRead, useMarkNotificationRead } from '@/lib/hooks/useNotifications';
import { NotificationList } from './NotificationList';

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { data: notifications } = useNotifications();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const unreadCount = notifications?.filter((n) => !n.isRead).length ?? 0;

  return (
    <div className="relative">
      <button onClick={() => setOpen((o) => !o)} className="relative rounded-md p-2 hover:bg-slate-100">
        <Bell className="h-5 w-5 text-ink-muted" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[10px] font-medium text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-20 mt-2 w-80 rounded-lg border border-slate-200 bg-white shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
            <span className="text-sm font-medium text-ink">Notifications</span>
            {unreadCount > 0 && (
              <button onClick={() => markAllRead.mutate()} className="text-xs text-brand hover:text-brand-hover">
                Mark all read
              </button>
            )}
          </div>
          <NotificationList notifications={notifications} onSelect={(id) => markRead.mutate(id)} />
        </div>
      )}
    </div>
  );
}


