'use client';

import { Minus, Plus, X } from 'lucide-react';
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';
import { useCartStore, type CartLine } from '@/lib/stores/cartStore';

export function CartLineItem({ line }: { line: CartLine }) {
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeLine = useCartStore((s) => s.removeLine);
  const lineTotal = (line.unitPrice + line.modifierTotal) * line.quantity;

  return (
    <div className="flex items-start justify-between py-2.5">
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-ink">{line.productName}</p>
        {line.modifierLabels.length > 0 && (
          <p className="truncate text-xs text-ink-muted">{line.modifierLabels.join(', ')}</p>
        )}
        <div className="mt-1.5 flex items-center gap-2">
          <button
            onClick={() => updateQuantity(line.localId, line.quantity - 1)}
            className="flex h-6 w-6 items-center justify-center rounded border border-slate-200 text-ink-muted hover:bg-slate-50"
          >
            <Minus className="h-3 w-3" />
          </button>
          <span className="tabular w-4 text-center text-sm">{line.quantity}</span>
          <button
            onClick={() => updateQuantity(line.localId, line.quantity + 1)}
            className="flex h-6 w-6 items-center justify-center rounded border border-slate-200 text-ink-muted hover:bg-slate-50"
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <CurrencyDisplay amount={lineTotal} size="sm" className="font-medium" />
        <button onClick={() => removeLine(line.localId)} className="text-ink-faint hover:text-danger">
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}


