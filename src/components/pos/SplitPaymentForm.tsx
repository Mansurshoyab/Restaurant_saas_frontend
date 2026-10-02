'use client';

import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';
import { PaymentMethodTabs } from './PaymentMethodTabs';
import { CashChangeCalculator } from './CashChangeCalculator';
import { PAYMENT_METHOD, type PaymentMethod } from '@/lib/constants';
import { cn } from '@/lib/utils/cn';
import type { PaymentLineInput } from '@/types/payment.types';

interface DraftLine {
  id: string;
  method: PaymentMethod;
  amount: string;
  amountReceived: string; // CASH only
  transactionId: string; // BKASH/NAGAD only
}

function newLine(amount: string): DraftLine {
  return {
    id: crypto.randomUUID(),
    method: PAYMENT_METHOD.CASH,
    amount,
    amountReceived: '',
    transactionId: '',
  };
}

export function SplitPaymentForm({
  orderTotal,
  onSubmit,
  isSubmitting,
}: {
  orderTotal: number;
  onSubmit: (payments: PaymentLineInput[]) => void;
  isSubmitting: boolean;
}) {
  const [isSplit, setIsSplit] = useState(false);
  const [lines, setLines] = useState<DraftLine[]>([newLine(orderTotal.toFixed(2))]);

  const totalEntered = lines.reduce((sum, l) => sum + (Number(l.amount) || 0), 0);
  const remaining = Math.round((orderTotal - totalEntered) * 100) / 100;
  const balanced = remaining === 0;

  const updateLine = (id: string, patch: Partial<DraftLine>) =>
    setLines((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  const addSplitLine = () => {
    setIsSplit(true);
    setLines((prev) => [...prev, newLine(remaining > 0 ? remaining.toFixed(2) : '')]);
  };

  const removeLine = (id: string) => setLines((prev) => prev.filter((l) => l.id !== id));

  const canSubmit =
    balanced &&
    lines.every((l) => {
      if (Number(l.amount) <= 0) return false;
      if (l.method === PAYMENT_METHOD.CASH) return Number(l.amountReceived || l.amount) >= Number(l.amount);
      if (l.method === PAYMENT_METHOD.BKASH || l.method === PAYMENT_METHOD.NAGAD) return l.transactionId.trim().length > 0;
      return true;
    });

  const handleSubmit = () => {
    const payments: PaymentLineInput[] = lines.map((l) => ({
      method: l.method,
      amount: Number(l.amount),
      ...(l.method === PAYMENT_METHOD.CASH
        ? { amountReceived: Number(l.amountReceived || l.amount) }
        : {}),
      ...(l.transactionId ? { transactionId: l.transactionId } : {}),
    }));
    onSubmit(payments);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between rounded-md bg-slate-50 px-4 py-3">
        <span className="text-sm font-medium text-ink-muted">Total due</span>
        <CurrencyDisplay amount={orderTotal} size="xl" />
      </div>

      <div className="space-y-4">
        {lines.map((line, i) => (
          <div
            key={line.id}
            className={cn('space-y-3', isSplit && 'rounded-md border border-slate-200 p-3')}
          >
            {isSplit && (
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium uppercase text-ink-muted">Payment {i + 1}</span>
                {lines.length > 1 && (
                  <button onClick={() => removeLine(line.id)} className="text-ink-faint hover:text-danger">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            )}

            <PaymentMethodTabs value={line.method} onChange={(method) => updateLine(line.id, { method })} />

            {isSplit && (
              <Input
                label="Amount"
                type="number"
                min={0}
                step="0.01"
                value={line.amount}
                onChange={(e) => updateLine(line.id, { amount: e.target.value })}
              />
            )}

            {line.method === PAYMENT_METHOD.CASH && (
              <CashChangeCalculator
                amountDue={Number(line.amount) || 0}
                amountReceived={line.amountReceived}
                onChangeReceived={(v) => updateLine(line.id, { amountReceived: v })}
              />
            )}

            {(line.method === PAYMENT_METHOD.BKASH || line.method === PAYMENT_METHOD.NAGAD) && (
              <Input
                label="Transaction ID"
                value={line.transactionId}
                onChange={(e) => updateLine(line.id, { transactionId: e.target.value })}
                placeholder="From the restaurant's own account"
                required
              />
            )}
          </div>
        ))}
      </div>

      {!isSplit && (
        <button onClick={addSplitLine} className="flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand-hover">
          <Plus className="h-4 w-4" /> Split into multiple payments
        </button>
      )}

      {isSplit && remaining !== 0 && (
        <p className={cn('text-sm', remaining > 0 ? 'text-warning' : 'text-danger')}>
          {remaining > 0 ? `${remaining.toFixed(2)} remaining` : `Over by ${Math.abs(remaining).toFixed(2)}`}
        </p>
      )}

      <Button
        className="w-full"
        size="lg"
        disabled={!canSubmit}
        isLoading={isSubmitting}
        onClick={handleSubmit}
      >
        Complete payment
      </Button>
    </div>
  );
}


