'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Dialog } from '@/components/ui/Dialog';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useOpenShift } from '@/lib/hooks/useShift';
import { normalizeApiError } from '@/lib/api/client';

export function ShiftOpenDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [openingCash, setOpeningCash] = useState('');
  const openShift = useOpenShift();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await openShift.mutateAsync(Number(openingCash));
      toast.success('Shift opened');
      onClose();
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} title="Open your shift">
      <p className="mb-3 text-sm text-ink-muted">Count the cash drawer before you start.</p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Opening cash amount"
          type="number"
          min={0}
          step="0.01"
          value={openingCash}
          onChange={(e) => setOpeningCash(e.target.value)}
          autoFocus
          required
        />
        <Button type="submit" className="w-full" isLoading={openShift.isPending}>
          Open shift
        </Button>
      </form>
    </Dialog>
  );
}


