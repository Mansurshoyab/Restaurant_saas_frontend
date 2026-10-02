import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { decodeAccessToken, hasPermission } from '@/lib/utils/permissions';
import type { AccessTokenPayload, AuthTokens } from '@/types/auth.types';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: AccessTokenPayload | null;
  isHydrated: boolean;

  setTokens: (tokens: AuthTokens) => void;
  clearAuth: () => void;
  setHydrated: () => void;
  can: (permission: string | string[]) => boolean;
}

// Persisted to localStorage so a page refresh doesn't log the user out.
// Only the refresh token strictly needs persistence (access tokens are
// short-lived and re-derived), but persisting both avoids a flash of
// "logged out" state before the first refresh call completes.
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      isHydrated: false,

      setTokens: ({ accessToken, refreshToken }) => {
        const decoded = decodeAccessToken(accessToken);
        set({ accessToken, refreshToken, user: decoded });
      },

      clearAuth: () => {
        set({ accessToken: null, refreshToken: null, user: null });
      },

      setHydrated: () => set({ isHydrated: true }),

      can: (permission) => {
        const user = get().user;
        if (!user) return false;
        if (user.isSuperAdmin) return true;
        return hasPermission(user.permissions, permission);
      },
    }),
    {
      name: 'restaurant-saas-auth',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);


