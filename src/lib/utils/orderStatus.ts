import { ORDER_STATUS, type OrderStatus } from '@/lib/constants';

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  DRAFT: 'Draft',
  CONFIRMED: 'Confirmed',
  PREPARING: 'Preparing',
  READY: 'Ready',
  SERVED: 'Served',
  PICKED_UP: 'Picked Up',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

// Tailwind class fragments — consumed by <OrderStatusBadge>
export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  DRAFT: 'bg-slate-100 text-slate-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  PREPARING: 'bg-amber-100 text-amber-700',
  READY: 'bg-purple-100 text-purple-700',
  SERVED: 'bg-teal-100 text-teal-700',
  PICKED_UP: 'bg-teal-100 text-teal-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

// Mirrors the allowed transitions in order.service.js's updateOrderStatus
// — used to disable invalid status buttons in the UI before the request
// even goes out.
export const NEXT_STATUS_OPTIONS: Partial<Record<OrderStatus, OrderStatus[]>> = {
  [ORDER_STATUS.CONFIRMED]: [ORDER_STATUS.PREPARING],
  [ORDER_STATUS.PREPARING]: [ORDER_STATUS.READY],
  [ORDER_STATUS.READY]: [ORDER_STATUS.SERVED, ORDER_STATUS.PICKED_UP],
};


