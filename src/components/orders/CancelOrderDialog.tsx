'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export function CancelOrderDialog({
  onConfirm,
  onCancel,
  isLoading,
}: {
  onConfirm: (reason: string) => void;
  onCancel: () => void;
  isLoading: boolean;
}) {
  const [reason, setReason] = useState('');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-5">
        <h3 className="font-semibold text-ink">Cancel order</h3>
        <p className="mt-1 text-sm text-ink-muted">This can't be undone.</p>
        <div className="mt-3">
          <Input label="Reason" value={reason} onChange={(e) => setReason(e.target.value)} autoFocus required />
        </div>
        <div className="mt-4 flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={onCancel}>
            Keep order
          </Button>
          <Button variant="danger" className="flex-1" disabled={!reason.trim()} isLoading={isLoading} onClick={() => onConfirm(reason)}>
            Cancel order
          </Button>
        </div>
      </div>
    </div>
  );
}


