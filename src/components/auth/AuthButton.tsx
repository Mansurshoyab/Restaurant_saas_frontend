'use client';

import { ArrowRight, Loader2 } from 'lucide-react';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingLabel?: string;
}

export function AuthButton({ isLoading, loadingLabel = 'Please wait…', children, className, disabled, ...props }: AuthButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={cn(
        'mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-brand py-3.5 text-base font-semibold text-white transition-all',
        'shadow-[0_0_20px_rgba(234,88,12,0.3)] hover:bg-brand-hover hover:shadow-[0_0_30px_rgba(234,88,12,0.5)]',
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-5 w-5 animate-spin" /> {loadingLabel}
        </>
      ) : (
        <>
          {children} <ArrowRight className="h-5 w-5" />
        </>
      )}
    </button>
  );
}


