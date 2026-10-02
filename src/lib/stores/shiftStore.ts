import { create } from 'zustand';

interface OpenShift {
  _id: string;
  openingCash: number;
  openedAt: string;
}

// Cached client-side so PosTopbar can render shift status instantly
// without a request on every navigation. useShift.ts hydrates this
// from GET /pos/shifts/my-open on mount and keeps it in sync.
interface ShiftState {
  openShift: OpenShift | null;
  setOpenShift: (shift: OpenShift | null) => void;
}

export const useShiftStore = create<ShiftState>((set) => ({
  openShift: null,
  setOpenShift: (shift) => set({ openShift: shift }),
}));


