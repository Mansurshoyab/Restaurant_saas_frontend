'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, ...props }, ref) => {
    const inputId = id ?? props.name;
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-ink">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'h-11 w-full rounded-md border border-slate-200 bg-white px-3.5 text-sm text-ink placeholder:text-ink-faint',
            'focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand',
            error && 'border-danger focus:border-danger focus:ring-danger',
            className
          )}
          {...props}
        />
        {error && <p className="text-sm text-danger">{error}</p>}
      </div>
    );
  }
);
Input.displayName = 'Input';


