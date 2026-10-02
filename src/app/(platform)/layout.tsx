'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';
import { PlatformSidebar } from '@/components/platform/PlatformSidebar';
import { PlatformTopbar } from '@/components/platform/PlatformTopbar';

export default function PlatformLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => !!s.accessToken);
  const isSuperAdmin = useAuthStore((s) => s.user?.isSuperAdmin);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  useEffect(() => {
    if (!isHydrated) return;
    if (!isAuthenticated) return router.replace('/login');
    if (!isSuperAdmin) return router.replace('/dashboard');
  }, [isHydrated, isAuthenticated, isSuperAdmin, router]);

  if (!isHydrated || !isAuthenticated || !isSuperAdmin) return null;

  return (
    <div className="flex h-screen overflow-hidden">
      <PlatformSidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <PlatformTopbar />
        <main className="flex-1 overflow-y-auto bg-app p-6">{children}</main>
      </div>
    </div>
  );
}
