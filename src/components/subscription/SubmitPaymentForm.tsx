'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { usePlans, useSubmitPaymentRequest } from '@/lib/hooks/useSubscription';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardBody } from '@/components/ui/Card';
import { CurrencyDisplay } from '@/components/shared/CurrencyDisplay';
import { cn } from '@/lib/utils/cn';
import { normalizeApiError } from '@/lib/api/client';

export function SubmitPaymentForm({ onSuccess }: { onSuccess: () => void }) {
  const { data: plans } = usePlans();
  const submitRequest = useSubmitPaymentRequest();

  const [planId, setPlanId] = useState('');
  const [senderBkashNumber, setSenderBkashNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [screenshot, setScreenshot] = useState<File | undefined>();

  const selectedPlan = plans?.find((p) => p._id === planId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitRequest.mutateAsync({ planId, senderBkashNumber, transactionId, screenshot });
      toast.success('Payment submitted for review');
      onSuccess();
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {plans?.map((plan) => (
          <button
            key={plan._id}
            type="button"
            onClick={() => setPlanId(plan._id)}
            className={cn(
              'flex items-center justify-between rounded-md border p-4 text-left',
              planId === plan._id ? 'border-brand bg-brand-light' : 'border-slate-200'
            )}
          >
            <div>
              <p className="font-medium text-ink">{plan.name}</p>
              <p className="text-xs text-ink-muted">{plan.billingCycle}</p>
            </div>
            <CurrencyDisplay amount={plan.price} size="lg" />
          </button>
        ))}
      </div>

      {selectedPlan && (
        <Card>
          <CardBody className="space-y-3 py-4 text-sm">
            <p className="font-medium text-ink">How to pay</p>
            <ol className="list-inside list-decimal space-y-1 text-ink-muted">
              <li>Open your bKash app</li>
              <li>Send Money to <span className="font-medium text-ink">01XXXXXXXXX</span></li>
              <li>
                Amount: <CurrencyDisplay amount={selectedPlan.price} size="sm" />
              </li>
              <li>Copy the Transaction ID from the confirmation SMS</li>
              <li>Submit it below — we'll verify and activate within a few hours</li>
            </ol>
          </CardBody>
        </Card>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Your bKash number (the one you paid from)"
          value={senderBkashNumber}
          onChange={(e) => setSenderBkashNumber(e.target.value)}
          placeholder="01700000000"
          required
        />
        <Input
          label="Transaction ID"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          placeholder="e.g. 9XJ2K8L1M0"
          required
        />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-ink">Payment screenshot (optional)</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setScreenshot(e.target.files?.[0])}
            className="block w-full text-sm text-ink-muted"
          />
        </div>

        <Button type="submit" className="w-full" disabled={!planId} isLoading={submitRequest.isPending}>
          Submit for verification
        </Button>
      </form>
    </div>
  );
}

