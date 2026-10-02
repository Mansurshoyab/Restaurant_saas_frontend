'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Clock, LogOut, User, LayoutDashboard } from 'lucide-react';
import { useShiftStore } from '@/lib/stores/shiftStore';
import { useAuthStore } from '@/lib/stores/authStore';
import { useLogout } from '@/lib/hooks/useAuth';
import { formatTime } from '@/lib/utils/date';
import { ShiftOpenDialog } from '@/components/pos/ShiftOpenDialog';
import { ShiftCloseDialog } from '@/components/pos/ShiftCloseDialog';
import { usePermissions } from '@/lib/hooks/usePermissions';
import { PERMISSIONS } from '@/lib/constants';
import { useRouter } from 'next/navigation';

export function PosTopbar() {
  const router = useRouter();
  const { can } = usePermissions();
  const openShift = useShiftStore((s) => s.openShift);
  const user = useAuthStore((s) => s.user);
  const logout = useLogout();
  const [showOpen, setShowOpen] = useState(false);
  const [showClose, setShowClose] = useState(false);

  return (
    <>
      <header className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push('/pos')} className="font-semibold text-ink">
            POS
          </button>
          {/* Only staff with settings access (OrgAdmin/BranchManager) get a
              way back to the admin dashboard — a plain Cashier never needs
              or should have that link cluttering their counter screen. */}
          {can(PERMISSIONS.SETTINGS_MANAGE) && (
            <Link
              href="/dashboard"
              className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-ink-muted hover:bg-slate-100 hover:text-ink"
            >
              <LayoutDashboard className="h-3.5 w-3.5" /> Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4 text-sm">
          {openShift ? (
            <button
              onClick={() => setShowClose(true)}
              className="flex items-center gap-1.5 rounded-full bg-success-light px-3 py-1 text-success"
            >
              <Clock className="h-3.5 w-3.5" />
              Shift open since {formatTime(openShift.openedAt)}
            </button>
          ) : (
            <button onClick={() => setShowOpen(true)} className="rounded-full bg-warning-light px-3 py-1 text-warning">
              No open shift
            </button>
          )}

          <span className="flex items-center gap-1.5 text-ink-muted">
            <User className="h-4 w-4" />
            {user?.role ?? 'Staff'}
          </span>

          <button onClick={() => logout.mutate()} className="flex items-center gap-1 text-ink-muted hover:text-danger">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </header>

      <ShiftOpenDialog open={showOpen} onClose={() => setShowOpen(false)} />
      <ShiftCloseDialog open={showClose} onClose={() => setShowClose(false)} onClosed={() => setShowClose(false)} />
    </>
  );
}


