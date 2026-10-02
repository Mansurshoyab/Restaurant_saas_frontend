'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import { inventoryApi } from '@/lib/api/inventory.api';
import { Button } from '@/components/ui/Button';
import { RecipeIngredientRow, type RecipeRow } from './RecipeIngredientRow';
import type { RecipeItem } from '@/types/recipe.types';

export function RecipeBuilder({
  initialItems,
  onSave,
  isSaving,
}: {
  initialItems: RecipeItem[];
  onSave: (items: RecipeRow[]) => void;
  isSaving: boolean;
}) {
  const { data: inventoryItems } = useQuery({ queryKey: ['inventory'], queryFn: () => inventoryApi.listItems() });

  const [rows, setRows] = useState<RecipeRow[]>(
    initialItems.length
      ? initialItems.map((item) => ({
          inventoryItemId: typeof item.inventoryItemId === 'string' ? item.inventoryItemId : item.inventoryItemId._id,
          quantity: item.quantity,
          unit: item.unit,
        }))
      : [{ inventoryItemId: '', quantity: 0, unit: '' }]
  );

  const updateRow = (i: number, patch: Partial<RecipeRow>) =>
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));

  const addRow = () => setRows((prev) => [...prev, { inventoryItemId: '', quantity: 0, unit: '' }]);
  const removeRow = (i: number) => setRows((prev) => prev.filter((_, idx) => idx !== i));

  const canSave = rows.every((r) => r.inventoryItemId && r.quantity > 0);

  return (
    <div className="space-y-3">
      {rows.map((row, i) => (
        <RecipeIngredientRow
          key={i}
          row={row}
          inventoryItems={inventoryItems}
          onChange={(patch) => updateRow(i, patch)}
          onRemove={() => removeRow(i)}
        />
      ))}

      <button onClick={addRow} className="flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand-hover">
        <Plus className="h-4 w-4" /> Add ingredient
      </button>

      <Button disabled={!canSave} isLoading={isSaving} onClick={() => onSave(rows)}>
        Save recipe
      </Button>
    </div>
  );
}



