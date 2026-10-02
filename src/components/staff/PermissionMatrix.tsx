'use client';

import { cn } from '@/lib/utils/cn';
import type { Permission } from '@/lib/api/roles.api';

export function PermissionMatrix({
  permissions,
  selected,
  onToggle,
}: {
  permissions: Permission[];
  selected: string[];
  onToggle: (key: string) => void;
}) {
  const grouped = permissions.reduce<Record<string, Permission[]>>((acc, p) => {
    acc[p.module] = acc[p.module] ?? [];
    acc[p.module].push(p);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      {Object.entries(grouped).map(([module, perms]) => (
        <div key={module}>
          <p className="mb-1.5 text-sm font-medium capitalize text-ink">{module}</p>
          <div className="grid grid-cols-2 gap-1.5">
            {perms.map((p) => (
              <label
                key={p.key}
                className={cn(
                  'flex items-center gap-2 rounded-md border px-3 py-2 text-sm',
                  selected.includes(p.key) ? 'border-brand bg-brand-light' : 'border-slate-200'
                )}
              >
                <input
                  type="checkbox"
                  checked={selected.includes(p.key)}
                  onChange={() => onToggle(p.key)}
                  className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
                />
                {p.key}
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}


