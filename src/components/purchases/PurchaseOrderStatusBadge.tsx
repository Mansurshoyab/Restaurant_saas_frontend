import { cn } from '@/lib/utils/cn';
import type { PurchaseStatus } from '@/lib/constants';

const styles: Record<PurchaseStatus, string> = {
  DRAFT: 'bg-slate-100 text-slate-700',
  SUBMITTED: 'bg-blue-100 text-blue-700',
  APPROVED: 'bg-amber-100 text-amber-700',
  PARTIALLY_RECEIVED: 'bg-purple-100 text-purple-700',
  RECEIVED: 'bg-green-100 text-green-700',
};

export function PurchaseOrderStatusBadge({ status }: { status: PurchaseStatus }) {
  return <span className={cn('rounded-full px-2.5 py-1 text-xs font-medium', styles[status])}>{status.replace('_', ' ')}</span>;
}


