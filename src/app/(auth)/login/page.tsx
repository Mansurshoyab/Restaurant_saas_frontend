'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { Mail, Lock, Smartphone } from 'lucide-react';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { AuthDivider } from '@/components/auth/AuthDivider';
import { useLogin } from '@/lib/hooks/useAuth';
import { normalizeApiError } from '@/lib/api/client';
import { useAuthStore } from '@/lib/stores/authStore';

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login.mutateAsync({ identifier, password });
      const user = useAuthStore.getState().user;
      router.push(user?.isSuperAdmin ? '/platform/dashboard' : '/dashboard');
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-xl">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white">Welcome back</h2>
        <p className="mt-2 text-sm text-zinc-400">Sign in to your account to continue</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInput
          label="Email or phone"
          icon={Mail}
          name="identifier"
          autoComplete="username"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
          placeholder="owner@restaurant.com"
          required
        />

        <AuthInput
          label="Password"
          icon={Lock}
          type="password"
          name="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
          trailing={
            <Link href="/forgot-password" className="text-xs font-medium text-brand transition-colors hover:text-orange-400">
              Forgot password?
            </Link>
          }
        />

        <AuthButton type="submit" isLoading={login.isPending} loadingLabel="Signing in…">
          Sign in
        </AuthButton>
      </form>

      <AuthDivider label="Or continue with" />

      <Link
        href="/otp"
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-zinc-900/80 py-3.5 text-sm font-medium text-white shadow-sm transition-all hover:bg-zinc-800"
      >
        <Smartphone className="h-4 w-4 text-zinc-400" />
        Log in with OTP
      </Link>

      <p className="mt-8 text-center text-sm text-zinc-400">
        Don't have an account?{' '}
        <Link href="/register" className="font-semibold text-white transition-colors hover:text-brand">
          Create your restaurant
        </Link>
      </p>
    </div>
  );
}


