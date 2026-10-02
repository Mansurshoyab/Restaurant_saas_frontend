import { cn } from '@/lib/utils/cn';

const variants = {
  default: 'bg-slate-100 text-slate-700',
  success: 'bg-success-light text-success',
  danger: 'bg-danger-light text-danger',
  warning: 'bg-warning-light text-warning',
  brand: 'bg-brand-light text-brand-hover',
};

export function Badge({
  children,
  variant = 'default',
  className,
}: {
  children: React.ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}) {
  return (
    <span className={cn('rounded-full px-2.5 py-1 text-xs font-medium', variants[variant], className)}>
      {children}
    </span>
  );
}

