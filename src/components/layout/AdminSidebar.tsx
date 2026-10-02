'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { usePermissions } from '@/lib/hooks/usePermissions';
import { NAV_ITEMS } from '@/lib/utils/navItems';
import { config } from '@/lib/config';
import { useSettings } from '@/lib/hooks/useSettings';

export function AdminSidebar() {
  const pathname = usePathname();
  const { can } = usePermissions();
  const { data: settings } = useSettings();

  const visibleItems = NAV_ITEMS.filter((item) => !item.permission || can(item.permission));

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-slate-200 bg-white">
      <div className="flex h-14 items-center gap-2 border-b border-slate-100 px-4">
        {settings?.logo && (
          <img src={settings.logo} alt="Logo" className="h-6 w-6 rounded object-contain" />
        )}
        <span className="font-semibold text-ink truncate">
          {settings?.name || config.appName}
        </span>
      </div>

      <nav className="flex-1 space-y-0.5 overflow-y-auto p-2">
        {visibleItems.map((item, i) => {
          const isActive = !item.external && pathname.startsWith(item.href.split('/').slice(0, 2).join('/'));
          const Icon = item.icon;

          return (
            <div key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium',
                  item.external
                    ? 'bg-brand text-white hover:bg-brand-hover'
                    : isActive
                    ? 'bg-brand-light text-brand-hover'
                    : 'text-ink-muted hover:bg-slate-50 hover:text-ink'
                )}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
              {/* Visual break after POS since it's a different surface, not another admin page */}
              {item.external && <div className="my-2 border-t border-slate-100" />}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}


