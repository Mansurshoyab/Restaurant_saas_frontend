import { formatCurrency } from '@/lib/utils/currency';
import { cn } from '@/lib/utils/cn';

export function CurrencyDisplay({
  amount,
  className,
  size = 'md',
}: {
  amount: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}) {
  const sizeClass = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-xl font-semibold',
    xl: 'text-3xl font-bold',
  }[size];

  return <span className={cn('tabular', sizeClass, className)}>{formatCurrency(amount)}</span>;
}


