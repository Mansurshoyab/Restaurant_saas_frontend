'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { rolesApi } from '@/lib/api/roles.api';
import { branchesApi } from '@/lib/api/branches.api';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import type { CreateStaffPayload } from '@/lib/api/users.api';

export function StaffForm({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: (payload: CreateStaffPayload) => void;
  isSubmitting: boolean;
}) {
  const { data: roles } = useQuery({ queryKey: ['roles'], queryFn: rolesApi.list });
  const { data: branches } = useQuery({ queryKey: ['branches'], queryFn: branchesApi.list });

  const [loginMethod, setLoginMethod] = useState<'password' | 'otp'>('password');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', roleId: '', branchId: '' });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit({
          name: form.name,
          email: form.email || undefined,
          phone: form.phone || undefined,
          password: loginMethod === 'password' ? form.password : undefined,
          roleId: form.roleId,
          branchId: form.branchId,
        });
      }}
      className="space-y-4"
    >
      <Input label="Full name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
      <Input
        label="Phone"
        value={form.phone}
        onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
        placeholder="01700000000"
        required
      />
      <Input
        label="Email (optional)"
        type="email"
        value={form.email}
        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
      />

      <div className="space-y-1.5">
        <label className="block text-sm font-medium text-ink">How will they log in?</label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setLoginMethod('password')}
            className={cn(
              'flex-1 rounded-md border px-3 py-2 text-sm',
              loginMethod === 'password' ? 'border-brand bg-brand-light' : 'border-slate-200'
            )}
          >
            Password (set by you)
          </button>
          <button
            type="button"
            onClick={() => setLoginMethod('otp')}
            className={cn(
              'flex-1 rounded-md border px-3 py-2 text-sm',
              loginMethod === 'otp' ? 'border-brand bg-brand-light' : 'border-slate-200'
            )}
          >
            OTP by SMS
          </button>
        </div>
      </div>

      {loginMethod === 'password' && (
        <Input
          label="Password"
          type="password"
          minLength={8}
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          required
        />
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-ink">Role</label>
          <select
            value={form.roleId}
            onChange={(e) => setForm((f) => ({ ...f, roleId: e.target.value }))}
            className="h-11 w-full rounded-md border border-slate-200 px-3.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            required
          >
            <option value="">Select role</option>
            {roles?.map((r) => (
              <option key={r._id} value={r._id}>
                {r.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-ink">Branch</label>
          <select
            value={form.branchId}
            onChange={(e) => setForm((f) => ({ ...f, branchId: e.target.value }))}
            className="h-11 w-full rounded-md border border-slate-200 px-3.5 text-sm focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
            required
          >
            <option value="">Select branch</option>
            {branches?.map((b) => (
              <option key={b._id} value={b._id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Button type="submit" isLoading={isSubmitting}>
        Create staff account
      </Button>
    </form>
  );
}


