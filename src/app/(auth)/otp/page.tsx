'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Phone, KeyRound } from 'lucide-react';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { useRequestOtp, useVerifyOtp } from '@/lib/hooks/useAuth';
import { normalizeApiError } from '@/lib/api/client';
import { useAuthStore } from '@/lib/stores/authStore';

export default function OtpLoginPage() {
  const router = useRouter();
  const requestOtp = useRequestOtp();
  const verifyOtp = useVerifyOtp();

  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');

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
      const user = useAuthStore.getState().user;
      router.push(user?.isSuperAdmin ? '/platform/dashboard' : '/dashboard');
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-xl">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white">Log in with OTP</h2>
        <p className="mt-2 text-sm text-zinc-400">
          {step === 'phone' ? "We'll text you a 6-digit code." : `Code sent to ${phone}.`}
        </p>
      </div>

      {step === 'phone' ? (
        <form onSubmit={handleRequest} className="space-y-5">
          <AuthInput label="Phone number" icon={Phone} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01700000000" required />
          <AuthButton type="submit" isLoading={requestOtp.isPending} loadingLabel="Sending…">
            Send code
          </AuthButton>
        </form>
      ) : (
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
            Verify and log in
          </AuthButton>
          <button
            type="button"
            onClick={() => setStep('phone')}
            className="w-full text-center text-sm text-zinc-500 transition-colors hover:text-white"
          >
            Use a different number
          </button>
        </form>
      )}

      <p className="mt-8 text-center text-sm text-zinc-400">
        <Link href="/login" className="font-semibold text-white transition-colors hover:text-brand">
          Log in with password instead
        </Link>
      </p>
    </div>
  );
}


