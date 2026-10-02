'use client';

import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, id, children, ...props }, ref) => {
    const selectId = id ?? props.name;
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={selectId} className="block text-sm font-medium text-ink">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={cn(
            'h-11 w-full rounded-md border border-slate-200 bg-white px-3.5 text-sm text-ink',
            'focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand',
            error && 'border-danger focus:border-danger focus:ring-danger',
            className
          )}
          {...props}
        >
          {children}
        </select>
        {error && <p className="text-sm text-danger">{error}</p>}
      </div>
    );
  }
);
Select.displayName = 'Select';


