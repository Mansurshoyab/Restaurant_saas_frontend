'use client';

import { Input } from '@/components/ui/Input';
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';

export function CashChangeCalculator({
  amountDue,
  amountReceived,
  onChangeReceived,
}: {
  amountDue: number;
  amountReceived: string;
  onChangeReceived: (value: string) => void;
}) {
  const received = Number(amountReceived) || 0;
  const change = received - amountDue;

  return (
    <div className="space-y-3">
      <Input
        label="Cash received"
        type="number"
        min={0}
        step="0.01"
        value={amountReceived}
        onChange={(e) => onChangeReceived(e.target.value)}
        placeholder={amountDue.toFixed(2)}
        autoFocus
      />
      {amountReceived && (
        <div className="flex items-center justify-between rounded-md bg-slate-50 px-3 py-2">
          <span className="text-sm text-ink-muted">{change >= 0 ? 'Change due' : 'Short by'}</span>
          <CurrencyDisplay
            amount={Math.abs(change)}
            size="lg"
            className={change < 0 ? 'text-danger' : 'text-success'}
          />
        </div>
      )}
    </div>
  );
}


