import { Check } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import type { PurchaseStatus } from '@/lib/constants';

const STEPS: PurchaseStatus[] = ['DRAFT', 'SUBMITTED', 'APPROVED', 'RECEIVED'];

export function PurchaseOrderTimeline({ current }: { current: PurchaseStatus }) {
  // PARTIALLY_RECEIVED sits visually between APPROVED and RECEIVED
  const effectiveIndex = current === 'PARTIALLY_RECEIVED' ? 2.5 : STEPS.indexOf(current);

  return (
    <div className="flex items-center">
      {STEPS.map((step, i) => {
        const isDone = i <= effectiveIndex;
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
              <span className={cn('mt-1 text-[11px]', isDone ? 'text-ink' : 'text-ink-faint')}>{step.replace('_', ' ')}</span>
            </div>
            {i < STEPS.length - 1 && <div className={cn('mx-1 h-0.5 flex-1', i < effectiveIndex ? 'bg-brand' : 'bg-slate-100')} />}
          </div>
        );
      })}
    </div>
  );
}


