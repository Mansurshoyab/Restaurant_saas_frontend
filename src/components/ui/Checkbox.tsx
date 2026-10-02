'use client';

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({ className, label, id, ...props }, ref) => {
  const checkboxId = id ?? props.name;
  return (
    <label htmlFor={checkboxId} className="flex items-center gap-2 text-sm text-ink">
      <input
        ref={ref}
        id={checkboxId}
        type="checkbox"
        className={cn('h-4 w-4 rounded border-slate-300 text-brand focus:ring-brand', className)}
        {...props}
      />
      {label}
    </label>
  );
});
Checkbox.displayName = 'Checkbox';


