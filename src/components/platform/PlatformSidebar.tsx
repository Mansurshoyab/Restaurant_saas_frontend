'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { LayoutDashboard, Building2, Package, Inbox } from 'lucide-react';
import { config } from '@/lib/config';

const NAV_ITEMS = [
  { href: '/platform/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/platform/organizations', label: 'Organizations', icon: Building2 },
  { href: '/platform/plans', label: 'Plans', icon: Package },
  { href: '/platform/subscriptions/requests', label: 'Subscription Requests', icon: Inbox },
];

export function PlatformSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-slate-800 bg-slate-900">
      <div className="flex h-14 items-center gap-2 border-b border-slate-800 px-4">
        <span className="font-bold text-white">{config.appName}</span>
        <span className="rounded bg-brand px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
          Platform
        </span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
