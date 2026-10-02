import { cn } from '@/lib/utils/cn';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/utils/orderStatus';
import type { OrderStatus } from '@/lib/constants';

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={cn('rounded-full px-2.5 py-1 text-xs font-medium', ORDER_STATUS_COLORS[status])}>
      {ORDER_STATUS_LABELS[status]}
    </span>
  );
}


