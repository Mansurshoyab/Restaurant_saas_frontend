'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useResetStaffPassword } from '@/lib/hooks/useStaff';
import { normalizeApiError } from '@/lib/api/client';

export function ResetPasswordDialog({ userId, onClose }: { userId: string; onClose: () => void }) {
  const [password, setPassword] = useState('');
  const resetPassword = useResetStaffPassword();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-5">
        <h3 className="font-semibold text-ink">Reset password</h3>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            try {
              await resetPassword.mutateAsync({ id: userId, password });
              toast.success('Password reset. All sessions logged out.');
              onClose();
            } catch (err) {
              toast.error(normalizeApiError(err).message);
            }
          }}
          className="mt-3 space-y-3"
        >
          <Input
            label="New password"
            type="password"
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            required
          />
          <div className="flex gap-2">
            <Button type="button" variant="secondary" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" isLoading={resetPassword.isPending}>
              Reset
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}


