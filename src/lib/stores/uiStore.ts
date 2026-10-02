import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UiState {
  sidebarCollapsed: boolean;
  activeBranchId: string | null;

  toggleSidebar: () => void;
  setActiveBranchId: (branchId: string | null) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      sidebarCollapsed: false,
      activeBranchId: null,

      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setActiveBranchId: (branchId) => set({ activeBranchId: branchId }),
    }),
    { name: 'restaurant-saas-ui' }
  )
);


