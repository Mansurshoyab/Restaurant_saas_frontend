'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function DiscountDialog({
  currentDiscount,
  subtotal,
  onApply,
  onClose,
}: {
  currentDiscount: number;
  subtotal: number;
  onApply: (discount: number) => void;
  onClose: () => void;
}) {
  const [discount, setDiscount] = useState(currentDiscount.toString());

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xs rounded-lg bg-white p-5">
        <h3 className="font-semibold text-ink">Apply discount</h3>
        <div className="mt-3">
          <Input
            label={`Discount amount (max ${subtotal.toFixed(2)})`}
            type="number"
            min={0}
            max={subtotal}
            step="0.01"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
            autoFocus
          />
        </div>
        <div className="mt-4 flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button className="flex-1" onClick={() => onApply(Number(discount) || 0)}>
            Apply
          </Button>
        </div>
      </div>
    </div>
  );
}


