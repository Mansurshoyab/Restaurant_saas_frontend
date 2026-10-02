'use client';

import { Trash2 } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { InventoryItem } from '@/types/inventory.types';
import type { CreatePOItemInput } from '@/lib/api/purchases.api';

export function PurchaseOrderLineForm({
  line,
  inventoryItems,
  onChange,
  onRemove,
  showRemove,
}: {
  line: CreatePOItemInput;
  inventoryItems: InventoryItem[] | undefined;
  onChange: (patch: Partial<CreatePOItemInput>) => void;
  onRemove: () => void;
  showRemove: boolean;
}) {
  return (
    <div className="flex items-end gap-2">
      <div className="flex-1">
        <Select label="Item" value={line.inventoryItemId} onChange={(e) => onChange({ inventoryItemId: e.target.value })}>
          <option value="">Select</option>
          {inventoryItems?.map((it) => (
            <option key={it._id} value={it._id}>
              {it.name} ({it.unit})
            </option>
          ))}
        </Select>
      </div>
      <div className="w-28">
        <Input
          label="Qty"
          type="number"
          min={0}
          step="0.001"
          value={line.orderedQuantity || ''}
          onChange={(e) => onChange({ orderedQuantity: Number(e.target.value) })}
        />
      </div>
      <div className="w-28">
        <Input
          label="Unit cost"
          type="number"
          min={0}
          step="0.01"
          value={line.unitCost || ''}
          onChange={(e) => onChange({ unitCost: Number(e.target.value) })}
        />
      </div>
      {showRemove && (
        <button type="button" onClick={onRemove} className="mb-2.5 text-ink-faint hover:text-danger">
          <Trash2 className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}


