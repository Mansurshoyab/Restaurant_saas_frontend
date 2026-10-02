'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { stockApi } from '@/lib/api/inventory.api';
import { useQueryClient } from '@tanstack/react-query';
import { normalizeApiError } from '@/lib/api/client';
import type { StockBalance } from '@/types/inventory.types';

export function ReorderLevelsForm({ itemId, balance }: { itemId: string; balance: StockBalance | undefined }) {
  const queryClient = useQueryClient();
  const [levels, setLevels] = useState({ minimumStock: '', reorderLevel: '', maximumStock: '' });
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await stockApi.setReorderLevels(itemId, {
        minimumStock: levels.minimumStock ? Number(levels.minimumStock) : undefined,
        reorderLevel: levels.reorderLevel ? Number(levels.reorderLevel) : undefined,
        maximumStock: levels.maximumStock ? Number(levels.maximumStock) : null,
      });
      queryClient.invalidateQueries({ queryKey: ['stock', 'balance', itemId] });
      toast.success('Reorder levels updated');
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input
        label="Low stock threshold (Minimum)"
        type="number"
        min={0}
        placeholder={String(balance?.minimumStock ?? 0)}
        value={levels.minimumStock}
        onChange={(e) => setLevels((l) => ({ ...l, minimumStock: e.target.value }))}
      />
      <Input
        label="Reorder level"
        type="number"
        min={0}
        placeholder={String(balance?.reorderLevel ?? 0)}
        value={levels.reorderLevel}
        onChange={(e) => setLevels((l) => ({ ...l, reorderLevel: e.target.value }))}
      />
      <Input
        label="Maximum stock"
        type="number"
        min={0}
        placeholder={balance?.maximumStock ? String(balance.maximumStock) : 'No limit'}
        value={levels.maximumStock}
        onChange={(e) => setLevels((l) => ({ ...l, maximumStock: e.target.value }))}
      />
      <Button type="submit" isLoading={isSaving}>
        Save levels
      </Button>
    </form>
  );
}

