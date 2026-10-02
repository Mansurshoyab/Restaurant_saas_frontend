'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface AuthInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
  trailing?: React.ReactNode;
}

export const AuthInput = forwardRef<HTMLInputElement, AuthInputProps>(
  ({ label, icon: Icon, trailing, className, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor={inputId} className="text-sm font-medium text-zinc-300">
            {label}
          </label>
          {trailing}
        </div>
        <div className="group relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-zinc-500 transition-colors group-focus-within:text-brand">
            <Icon className="h-5 w-5" />
          </div>
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'block w-full rounded-2xl border border-white/5 bg-zinc-950/50 py-3.5 pl-12 pr-4 text-sm text-white shadow-inner outline-none transition-all placeholder:text-zinc-600',
              'focus:border-brand focus:ring-1 focus:ring-brand',
              className
            )}
            {...props}
          />
        </div>
      </div>
    );
  }
);
AuthInput.displayName = 'AuthInput';

