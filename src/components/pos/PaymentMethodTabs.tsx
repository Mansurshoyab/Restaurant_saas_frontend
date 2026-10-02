'use client';

import { cn } from '@/lib/utils/cn';
import { PAYMENT_METHOD, type PaymentMethod } from '@/lib/constants';

const METHODS: { value: PaymentMethod; label: string }[] = [
  { value: PAYMENT_METHOD.CASH, label: 'Cash' },
  { value: PAYMENT_METHOD.CARD, label: 'Card' },
  { value: PAYMENT_METHOD.BKASH, label: 'bKash' },
  { value: PAYMENT_METHOD.NAGAD, label: 'Nagad' },
  { value: PAYMENT_METHOD.OTHER, label: 'Other' },
];

export function PaymentMethodTabs({
  value,
  onChange,
}: {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
}) {
  return (
    <div className="grid grid-cols-5 gap-2">
      {METHODS.map((m) => (
        <button
          key={m.value}
          onClick={() => onChange(m.value)}
          className={cn(
            'rounded-md border px-2 py-2.5 text-sm font-medium transition',
            value === m.value
              ? 'border-brand bg-brand-light text-brand-hover'
              : 'border-slate-200 text-ink-muted hover:bg-slate-50'
          )}
        >
          {m.label}
        </button>
      ))}
    </div>
  );
}


