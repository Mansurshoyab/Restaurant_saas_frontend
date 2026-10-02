'use client';

import { Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { InventoryItem } from '@/types/inventory.types';

export interface RecipeRow {
  inventoryItemId: string;
  quantity: number;
  unit: string;
}

export function RecipeIngredientRow({
  row,
  inventoryItems,
  onChange,
  onRemove,
}: {
  row: RecipeRow;
  inventoryItems: InventoryItem[] | undefined;
  onChange: (patch: Partial<RecipeRow>) => void;
  onRemove: () => void;
}) {
  const handleSelect = (itemId: string) => {
    const item = inventoryItems?.find((i) => i._id === itemId);
    onChange({ inventoryItemId: itemId, unit: item?.unit ?? '' });
  };

  return (
    <div className="flex items-end gap-2">
      <div className="flex-1">
        <Select label="Ingredient" value={row.inventoryItemId} onChange={(e) => handleSelect(e.target.value)}>
          <option value="">Select ingredient</option>
          {inventoryItems?.map((item) => (
            <option key={item._id} value={item._id}>
              {item.name} ({item.unit})
            </option>
          ))}
        </Select>
      </div>
      <div className="w-28">
        <Input
          label="Quantity"
          type="number"
          min={0}
          step="0.001"
          value={row.quantity || ''}
          onChange={(e) => onChange({ quantity: Number(e.target.value) })}
        />
      </div>
      <button onClick={onRemove} className="mb-2.5 text-ink-faint hover:text-danger">
        <Trash2 className="h-4 w-4" />
      </button>
    </div>
  );
}



