import { cn } from '@/lib/utils/cn';

const styles = {
  PENDING: 'bg-warning-light text-warning',
  APPROVED: 'bg-success-light text-success',
  REJECTED: 'bg-danger-light text-danger',
};

export function PaymentRequestStatusBadge({ status }: { status: 'PENDING' | 'APPROVED' | 'REJECTED' }) {
  return <span className={cn('rounded-full px-2.5 py-1 text-xs font-medium', styles[status])}>{status}</span>;
}


