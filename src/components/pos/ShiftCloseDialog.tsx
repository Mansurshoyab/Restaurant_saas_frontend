'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';
import { useCloseShift, useShiftSummary } from '@/lib/hooks/useShift';
import { normalizeApiError } from '@/lib/api/client';

export function ShiftCloseDialog({
  open,
  onClose,
  onClosed,
}: {
  open: boolean;
  onClose: () => void;
  onClosed: () => void;
}) {
  const { data: summary } = useShiftSummary();
  const closeShift = useCloseShift();
  const [closingCash, setClosingCash] = useState('');

  const variance = closingCash ? Number(closingCash) - (summary?.cash.expectedCash ?? 0) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await closeShift.mutateAsync({ closingCash: Number(closingCash) });
      toast.success('Shift closed');
      onClosed();
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} title="Close your shift">
      <div className="mb-3 space-y-1.5 rounded-md bg-slate-50 p-3 text-sm">
        <div className="flex justify-between">
          <span className="text-ink-muted">Opening cash</span>
          <CurrencyDisplay amount={summary?.cash.openingCash ?? 0} size="sm" />
        </div>
        <div className="flex justify-between">
          <span className="text-ink-muted">Cash sales</span>
          <CurrencyDisplay amount={summary?.cash.cashSales ?? 0} size="sm" />
        </div>
        <div className="flex justify-between border-t border-slate-200 pt-1.5 font-medium">
          <span>Expected in drawer</span>
          <CurrencyDisplay amount={summary?.cash.expectedCash ?? 0} size="sm" />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Counted cash amount"
          type="number"
          min={0}
          step="0.01"
          value={closingCash}
          onChange={(e) => setClosingCash(e.target.value)}
          autoFocus
          required
        />
        {variance !== null && (
          <p className={variance === 0 ? 'text-sm text-success' : 'text-sm text-danger'}>
            {variance === 0 ? 'Matches exactly.' : `Variance: ${variance > 0 ? '+' : ''}${variance.toFixed(2)}`}
          </p>
        )}
        <Button type="submit" className="w-full" isLoading={closeShift.isPending}>
          Close shift
        </Button>
      </form>
    </Dialog>
  );
}


