'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/stores/authStore';

export default function RootPage() {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => !!s.accessToken);
  const isHydrated = useAuthStore((s) => s.isHydrated);

  const isSuperAdmin = useAuthStore((s) => s.user?.isSuperAdmin);

  useEffect(() => {
    if (!isHydrated) return;
    router.replace(isAuthenticated ? (isSuperAdmin ? '/platform/dashboard' : '/dashboard') : '/login');
  }, [isHydrated, isAuthenticated, isSuperAdmin, router]);

  return null;
}


