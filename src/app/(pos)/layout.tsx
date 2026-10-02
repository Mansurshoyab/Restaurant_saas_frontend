'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { useMyOpenShift } from '@/lib/hooks/useShift';
import { PosTopbar } from '@/components/layout/PosTopbar';

export default function PosLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => !!s.accessToken);
  const isSuperAdmin = useAuthStore((s) => s.user?.isSuperAdmin);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  useMyOpenShift(); // hydrates shiftStore for PosTopbar

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated) return router.replace('/login');
    if (isSuperAdmin) return router.replace('/platform/dashboard');
  }, [isHydrated, isAuthenticated, isSuperAdmin, router]);

  if (!isHydrated || !isAuthenticated) return null;

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <PosTopbar />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  );
}


