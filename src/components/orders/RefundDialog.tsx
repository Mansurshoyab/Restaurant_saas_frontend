'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { paymentsApi } from '@/lib/api/payments.api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { normalizeApiError } from '@/lib/api/client';
import { useQueryClient } from '@tanstack/react-query';

export function RefundDialog({
  orderId,
  maxAmount,
  onClose,
}: {
  orderId: string;
  maxAmount: number;
  onClose: () => void;
}) {
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState(maxAmount.toString());
  const [method, setMethod] = useState('CASH');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await paymentsApi.refund({ orderId, amount: Number(amount), method, reason });
      queryClient.invalidateQueries({ queryKey: ['orders', orderId] });
      toast.success('Refund recorded');
      onClose();
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 rounded-lg bg-white p-5">
        <h3 className="font-semibold text-ink">Refund order</h3>
        <Input label="Amount" type="number" min={0} max={maxAmount} step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} required />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-ink">Method</label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="h-11 w-full rounded-md border border-slate-200 px-3.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
          >
            <option value="CASH">Cash</option>
            <option value="CARD">Card</option>
            <option value="BKASH">bKash</option>
            <option value="NAGAD">Nagad</option>
          </select>
        </div>
        <Input label="Reason" value={reason} onChange={(e) => setReason(e.target.value)} required />
        <div className="flex gap-2">
          <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="danger" className="flex-1" isLoading={isSubmitting}>
            Refund
          </Button>
        </div>
      </form>
    </div>
  );
}


