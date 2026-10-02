import { Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { ORDER_STATUS_LABELS } from '@/lib/utils/orderStatus';
import { ORDER_STATUS, type OrderStatus } from '@/lib/constants';

const STEPS: OrderStatus[] = [
  ORDER_STATUS.CONFIRMED,
  ORDER_STATUS.PREPARING,
  ORDER_STATUS.READY,
  ORDER_STATUS.SERVED,
  ORDER_STATUS.COMPLETED,
];

export function OrderTimeline({ current }: { current: OrderStatus }) {
  if (current === ORDER_STATUS.CANCELLED) {
    return <p className="text-sm text-danger">This order was cancelled.</p>;
  }

  const currentIndex = STEPS.indexOf(current);

  return (
    <div className="flex items-center">
      {STEPS.map((step, i) => {
        const isDone = i <= currentIndex;
        return (
          <div key={step} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium',
                  isDone ? 'bg-brand text-white' : 'bg-slate-100 text-ink-faint'
                )}
              >
                {isDone ? <Check className="h-3.5 w-3.5" /> : i + 1}
              </div>
              <span className={cn('mt-1 text-[11px]', isDone ? 'text-ink' : 'text-ink-faint')}>
                {ORDER_STATUS_LABELS[step]}
              </span>
            </div>
            {i < STEPS.length - 1 && <div className={cn('mx-1 h-0.5 flex-1', i < currentIndex ? 'bg-brand' : 'bg-slate-100')} />}
          </div>
        );
      })}
    </div>
  );
}


