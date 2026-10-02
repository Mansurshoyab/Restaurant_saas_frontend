'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { UtensilsCrossed, User, Mail, Phone, Lock } from 'lucide-react';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';
import { useRegister } from '@/lib/hooks/useAuth';
import { normalizeApiError } from '@/lib/api/client';

export default function RegisterPage() {
  const router = useRouter();
  const register = useRegister();
  const [form, setForm] = useState({
    restaurantName: '',
    ownerName: '',
    email: '',
    phone: '',
    password: '',
  });

  const update = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register.mutateAsync(form);
      toast.success('Restaurant created. Your 14-day trial has started.');
      router.push('/dashboard');
    } catch (err) {
      toast.error(normalizeApiError(err).message);
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-zinc-900/50 p-8 shadow-2xl backdrop-blur-xl">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-white">Create your restaurant</h2>
        <p className="mt-2 text-sm text-zinc-400">Starts with a 14-day free trial. No card required.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <AuthInput
          label="Restaurant name"
          icon={UtensilsCrossed}
          value={form.restaurantName}
          onChange={update('restaurantName')}
          placeholder="Burger House"
          required
        />
        <AuthInput label="Your name" icon={User} value={form.ownerName} onChange={update('ownerName')} placeholder="Rahim Uddin" required />
        <AuthInput
          label="Email"
          icon={Mail}
          type="email"
          value={form.email}
          onChange={update('email')}
          placeholder="owner@restaurant.com"
          required
        />
        <AuthInput label="Phone (optional)" icon={Phone} value={form.phone} onChange={update('phone')} placeholder="01700000000" />
        <AuthInput
          label="Password"
          icon={Lock}
          type="password"
          value={form.password}
          onChange={update('password')}
          placeholder="At least 8 characters"
          minLength={8}
          required
        />

        <AuthButton type="submit" isLoading={register.isPending} loadingLabel="Creating…">
          Create restaurant
        </AuthButton>
      </form>

      <p className="mt-8 text-center text-sm text-zinc-400">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-white transition-colors hover:text-brand">
          Log in
        </Link>
      </p>
    </div>
  );
}


