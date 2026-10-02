'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardBody } from '@/components/ui/Card';
import { useOpenShift } from '@/lib/hooks/useShift';
import { normalizeApiError } from '@/lib/api/client';

export default function OpenShiftPage() {
  const router = useRouter();
  const openShift = useOpenShift();
  const [openingCash, setOpeningCash] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await openShift.mutateAsync(Number(openingCash));
      toast.success('Shift opened');
      router.push('/pos/tables');
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    }
  };

  return (
    <div className="flex h-full items-center justify-center p-6">
      <Card className="w-full max-w-sm">
        <CardBody className="space-y-4 py-6">
          <h1 className="text-base font-semibold text-ink">Open your shift</h1>
          <p className="text-sm text-ink-muted">Count the cash drawer before you start.</p>

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
            <Button type="submit" className="w-full" size="lg" isLoading={openShift.isPending}>
              Open shift
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}


