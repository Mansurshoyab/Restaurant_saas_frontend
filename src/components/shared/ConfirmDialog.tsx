'use client';

import { Button } from '@/components/ui/Button';

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Confirm',
  danger,
  onConfirm,
  onCancel,
  isLoading,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-5">
        <h3 className="font-semibold text-ink">{title}</h3>
        <p className="mt-1.5 text-sm text-ink-muted">{message}</p>
        <div className="mt-5 flex gap-2">
          <Button variant="secondary" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
          <Button
            variant={danger ? 'danger' : 'primary'}
            className="flex-1"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}


