'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminTopbar } from '@/components/layout/AdminTopbar';
import { SubscriptionLockedBanner } from '@/components/subscription/SubscriptionLockedBanner';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => !!s.accessToken);
  const isSuperAdmin = useAuthStore((s) => s.user?.isSuperAdmin);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated) return router.replace('/login');
    if (isSuperAdmin) return router.replace('/platform/dashboard');
  }, [isHydrated, isAuthenticated, isSuperAdmin, router]);

  if (!isHydrated || !isAuthenticated) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminTopbar />
        <SubscriptionLockedBanner />
        <main className="flex-1 overflow-y-auto bg-app p-6">{children}</main>
      </div>
    </div>
  );
}


