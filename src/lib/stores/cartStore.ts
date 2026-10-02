import { create } from 'zustand';
import type { OrderType } from '@/lib/constants';

// Client-side cart built BEFORE any Order document exists on the
// backend. Add-to-cart taps stay instant and offline-tolerant; the
// actual POST /orders (DRAFT creation) fires once, when the cashier
// is ready to send it to the kitchen — not on every tap.
export interface CartLine {
  localId: string; // client-generated, since there's no OrderItem._id yet
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  modifierIds: string[];
  modifierLabels: string[]; // for display only
  modifierTotal: number;
}

interface CartState {
  orderType: OrderType | null;
  tableId: string | null;
  lines: CartLine[];

  setOrderType: (type: OrderType) => void;
  setTableId: (tableId: string | null) => void;
  addLine: (line: Omit<CartLine, 'localId'>) => void;
  updateQuantity: (localId: string, quantity: number) => void;
  removeLine: (localId: string) => void;
  clearCart: () => void;

  subtotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  orderType: null,
  tableId: null,
  lines: [],

  setOrderType: (orderType) => set({ orderType }),
  setTableId: (tableId) => set({ tableId }),

  addLine: (line) =>
    set((s) => ({
      lines: [...s.lines, { ...line, localId: crypto.randomUUID() }],
    })),

  updateQuantity: (localId, quantity) =>
    set((s) => ({
      lines:
        quantity <= 0
          ? s.lines.filter((l) => l.localId !== localId)
          : s.lines.map((l) => (l.localId === localId ? { ...l, quantity } : l)),
    })),

  removeLine: (localId) => set((s) => ({ lines: s.lines.filter((l) => l.localId !== localId) })),

  clearCart: () => set({ orderType: null, tableId: null, lines: [] }),

  subtotal: () => {
    const { lines } = get();
    return lines.reduce((sum, l) => sum + (l.unitPrice + l.modifierTotal) * l.quantity, 0);
  },
}));


