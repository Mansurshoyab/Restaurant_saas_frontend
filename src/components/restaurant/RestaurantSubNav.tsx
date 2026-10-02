'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';

const TABS = [
  { label: 'Staff', href: '/restaurant/staff' },
  { label: 'Branches', href: '/restaurant/branches' },
  { label: 'Tables', href: '/restaurant/tables' },
];

export function RestaurantSubNav() {
  const pathname = usePathname();

  return (
    <div className="mb-4 flex gap-1 overflow-x-auto border-b border-slate-200">
      {TABS.map((tab) => (
        <Link
          key={tab.href}
          href={tab.href}
          className={cn(
            'shrink-0 border-b-2 px-3 py-2 text-sm font-medium',
            pathname.startsWith(tab.href) ? 'border-brand text-brand' : 'border-transparent text-ink-muted hover:text-ink'
          )}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}
