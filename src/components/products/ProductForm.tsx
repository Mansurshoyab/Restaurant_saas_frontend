'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { modifiersApi } from '@/lib/api/modifiers.api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CategoryPicker } from './CategoryPicker';
import type { CreateProductPayload, MenuProduct } from '@/types/product.types';

export function ProductForm({
  initial,
  onSubmit,
  isSubmitting,
}: {
  initial?: MenuProduct;
  onSubmit: (payload: CreateProductPayload) => void;
  isSubmitting: boolean;
}) {
  const { data: modifierGroups } = useQuery({ queryKey: ['modifiers', 'groups'], queryFn: modifiersApi.listGroups });

  const [form, setForm] = useState({
    name: initial?.name ?? '',
    sku: initial?.sku ?? '',
    categoryId: typeof initial?.categoryId === 'string' ? initial.categoryId : initial?.categoryId?._id ?? '',
    price: initial?.price?.toString() ?? '',
    tax: initial?.tax?.toString() ?? '',
    modifierGroupIds: (initial?.modifierGroupIds as string[]) ?? [],
  });

  const toggleModifierGroup = (id: string) => {
    setForm((f) => ({
      ...f,
      modifierGroupIds: f.modifierGroupIds?.includes(id)
        ? f.modifierGroupIds.filter((g) => g !== id)
        : [...(f.modifierGroupIds ?? []), id],
    }));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          ...form,
          price: Number(form.price),
          tax: form.tax === '' ? 0 : Number(form.tax),
        });
      }}
      className="space-y-4"
    >
      <Input label="Product name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />

      <div className="grid grid-cols-2 gap-4">
        <Input label="SKU (optional)" value={form.sku} onChange={(e) => setForm((f) => ({ ...f, sku: e.target.value }))} />
        <CategoryPicker value={form.categoryId} onChange={(categoryId) => setForm((f) => ({ ...f, categoryId }))} />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Price"
          type="number"
          min={0}
          step="0.01"
          value={form.price}
          onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
          required
        />
        <Input
          label="Tax %"
          type="number"
          min={0}
          max={100}
          value={form.tax}
          onChange={(e) => setForm((f) => ({ ...f, tax: e.target.value }))}
        />
      </div>

      {!!modifierGroups?.length && (
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Modifier groups</label>
          <div className="space-y-1.5">
            {modifierGroups.map((g) => (
              <label key={g._id} className="flex items-center gap-2 text-sm text-ink">
                <input
                  type="checkbox"
                  checked={form.modifierGroupIds?.includes(g._id)}
                  onChange={() => toggleModifierGroup(g._id)}
                  className="h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand"
                />
                {g.name}
              </label>
            ))}
          </div>
        </div>
      )}

      <Button type="submit" isLoading={isSubmitting}>
        {initial ? 'Save changes' : 'Create product'}
      </Button>
    </form>
  );
}


