'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardBody } from '@/components/ui/Card';
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';
import { useCloseShift, useShiftSummary } from '@/lib/hooks/useShift';
import { normalizeApiError } from '@/lib/api/client';

export default function CloseShiftPage() {
  const router = useRouter();
  const { data: summary, isLoading } = useShiftSummary();
  const closeShift = useCloseShift();
  const [closingCash, setClosingCash] = useState('');

  const variance = closingCash ? Number(closingCash) - (summary?.cash.expectedCash ?? 0) : null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await closeShift.mutateAsync({ closingCash: Number(closingCash) });
      toast.success('Shift closed');
      router.push('/login');
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    }
  };

  if (isLoading) return <p className="p-6 text-sm text-ink-muted">Loading shift summary…</p>;

  return (
    <div className="flex h-full items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardBody className="space-y-4 py-6">
          <h1 className="text-base font-semibold text-ink">Close your shift</h1>

          <div className="space-y-1.5 rounded-md bg-slate-50 p-3 text-sm">
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
                {variance === 0
                  ? 'Matches exactly.'
                  : `Variance: ${variance > 0 ? '+' : ''}${variance.toFixed(2)}`}
              </p>
            )}
            <Button type="submit" className="w-full" size="lg" isLoading={closeShift.isPending}>
              Close shift
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}



