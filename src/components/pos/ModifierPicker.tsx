'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { modifiersApi } from '@/lib/api/modifiers.api';
import { Button } from '@/components/ui/Button';
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';
import { cn } from '@/lib/utils/cn';
import type { MenuProduct, ModifierGroup } from '@/types/product.types';

interface Selection {
  modifierId: string;
  name: string;
  price: number;
}

export function ModifierPicker({
  product,
  onConfirm,
  onCancel,
}: {
  product: MenuProduct;
  onConfirm: (selections: Selection[]) => void;
  onCancel: () => void;
}) {
  const { data: allGroups } = useQuery({
    queryKey: ['modifiers', 'groups'],
    queryFn: modifiersApi.listGroups,
  });

  const productGroupIds = new Set(
    (product.modifierGroupIds as string[]).map((id) => (typeof id === 'string' ? id : (id as any)._id))
  );
  const relevantGroups = allGroups?.filter((g) => productGroupIds.has(g._id)) ?? [];

  const [selected, setSelected] = useState<Record<string, Selection[]>>({});

  const toggle = (group: ModifierGroup, modifier: { _id: string; name: string; price: number }) => {
    setSelected((prev) => {
      const current = prev[group._id] ?? [];
      const exists = current.some((s) => s.modifierId === modifier._id);

      if (group.selectionType === 'SINGLE') {
        return { ...prev, [group._id]: exists ? [] : [{ modifierId: modifier._id, name: modifier.name, price: modifier.price }] };
      }

      return {
        ...prev,
        [group._id]: exists
          ? current.filter((s) => s.modifierId !== modifier._id)
          : [...current, { modifierId: modifier._id, name: modifier.name, price: modifier.price }],
      };
    });
  };

  const canConfirm = relevantGroups.every((g) => !g.required || (selected[g._id]?.length ?? 0) >= (g.minSelect || 1));

  const handleConfirm = () => {
    const all = Object.values(selected).flat();
    onConfirm(all);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
      <div className="w-full max-w-md rounded-t-lg bg-white sm:rounded-lg">
        <div className="border-b border-slate-100 px-5 py-4">
          <h3 className="font-semibold text-ink">{product.name}</h3>
          <CurrencyDisplay amount={product.price} className="text-ink-muted" />
        </div>

        <div className="max-h-[50vh] overflow-y-auto px-5 py-4">
          {relevantGroups.length === 0 && <p className="text-sm text-ink-muted">No add-ons for this item.</p>}

          {relevantGroups.map((group) => (
            <div key={group._id} className="mb-5 last:mb-0">
              <p className="mb-2 text-sm font-medium text-ink">
                {group.name}
                {group.required && <span className="ml-1 text-danger">*</span>}
              </p>
              <div className="space-y-1.5">
                {group.modifiers?.map((mod) => {
                  const isSelected = selected[group._id]?.some((s) => s.modifierId === mod._id);
                  return (
                    <button
                      key={mod._id}
                      onClick={() => toggle(group, mod)}
                      className={cn(
                        'flex w-full items-center justify-between rounded-md border px-3 py-2 text-sm',
                        isSelected ? 'border-brand bg-brand-light' : 'border-slate-200'
                      )}
                    >
                      <span>{mod.name}</span>
                      <span className="tabular text-ink-muted">
                        {mod.price > 0 ? `+${mod.price}` : 'Free'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-2 border-t border-slate-100 px-5 py-4">
          <Button variant="secondary" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={handleConfirm} disabled={!canConfirm}>
            Add to order
          </Button>
        </div>
      </div>
    </div>
  );
}



