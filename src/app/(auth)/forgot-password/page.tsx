'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Phone, KeyRound, Lock } from 'lucide-react';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { useRequestOtp, useVerifyOtp, useChangePassword } from '@/lib/hooks/useAuth';
import { normalizeApiError } from '@/lib/api/client';

type Step = 'phone' | 'code' | 'newPassword';

export default function ForgotPasswordPage() {
  const requestOtp = useRequestOtp();
  const verifyOtp = useVerifyOtp();
  const changePassword = useChangePassword();

  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await requestOtp.mutateAsync({ phone });
      setStep('code');
      toast.success('Code sent by SMS.');
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await verifyOtp.mutateAsync({ phone, code });
      setStep('newPassword');
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    }
  };

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    // Backend's change-password requires currentPassword, which a
    // forgot-password user doesn't have — this needs a dedicated
    // reset-password endpoint on the backend before it can complete.
    toast.error('Password reset needs a backend update. Ask your OrgAdmin to reset your password for now.');
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-xl">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white">Reset password</h2>
        <p className="mt-2 text-sm text-zinc-400">
          {step === 'phone' && "We'll text you a code to verify it's you."}
          {step === 'code' && `Code sent to ${phone}.`}
          {step === 'newPassword' && 'Choose a new password.'}
        </p>
      </div>

      {step === 'phone' && (
        <form onSubmit={handleRequest} className="space-y-5">
          <AuthInput label="Phone number" icon={Phone} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01700000000" required />
          <AuthButton type="submit" isLoading={requestOtp.isPending} loadingLabel="Sending…">
            Send code
          </AuthButton>
        </form>
      )}

      {step === 'code' && (
        <form onSubmit={handleVerify} className="space-y-5">
          <AuthInput
            label="6-digit code"
            icon={KeyRound}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            inputMode="numeric"
            autoFocus
            required
          />
          <AuthButton type="submit" isLoading={verifyOtp.isPending} loadingLabel="Verifying…">
            Verify
          </AuthButton>
        </form>
      )}

      {step === 'newPassword' && (
        <form onSubmit={handleSetPassword} className="space-y-5">
          <AuthInput
            label="New password"
            icon={Lock}
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="At least 8 characters"
            minLength={8}
            autoFocus
            required
          />
          <AuthButton type="submit" isLoading={changePassword.isPending} loadingLabel="Saving…">
            Set new password
          </AuthButton>
        </form>
      )}

      <p className="mt-8 text-center text-sm text-zinc-400">
        <Link href="/login" className="font-semibold text-white transition-colors hover:text-brand">
          Back to login
        </Link>
      </p>
    </div>
  );
}


