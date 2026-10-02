'use client';

import { LogOut } from 'lucide-react';
import { useAuthStore } from '@/lib/stores/authStore';
import { useLogout } from '@/lib/hooks/useAuth';

export function PlatformTopbar() {
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();

  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-6">
      <div className="text-sm font-medium text-ink-muted">SuperAdmin Portal</div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-ink-muted">SuperAdmin</span>
          <button onClick={() => logout.mutate()} className="ml-2 text-ink-muted transition-colors hover:text-danger">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
