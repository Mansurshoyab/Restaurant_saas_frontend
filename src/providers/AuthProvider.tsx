'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/lib/stores/authStore';
import { registerInterceptors } from '@/lib/api/interceptors';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const registered = useRef(false);

  useEffect(() => {
    if (!registered.current) {
      registerInterceptors();
      registered.current = true;
    }
  }, []);

  // Avoid rendering children (which may branch on auth state) before
  // zustand's persist middleware has finished reading localStorage —
  // prevents a flash of "logged out" UI on every page load.
  if (!isHydrated) {
    return null; // or a full-page spinner
  }

  return <>{children}</>;
}


