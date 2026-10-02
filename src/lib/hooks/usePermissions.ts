'use client';

import { useAuthStore } from '@/lib/stores/authStore';

export function usePermissions() {
  const user = useAuthStore((s) => s.user);
  const can = useAuthStore((s) => s.can);

  return {
    user,
    can,
    isSuperAdmin: user?.isSuperAdmin ?? false,
    role: user?.role ?? null,
  };
}


