import type { OrderStatus, OrderType, PaymentStatus } from '@/lib/constants';

export interface OrderItemModifier {
  modifierId: string;
  name: string;
  price: number;
}

export interface OrderItem {
  _id: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  modifiers: OrderItemModifier[];
  recipeVersion: number | null;
  subtotal: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  orderType: OrderType;
  tableId: string | null;
  customerId: string | null;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  cancelReason: string | null;
  createdBy: string;
  completedAt: string | null;
  createdAt: string;
}

export interface CreateOrderItemInput {
  productId: string;
  quantity: number;
  modifierIds: string[];
}

export interface CreateOrderPayload {
  orderType: OrderType;
  tableId?: string;
  items: CreateOrderItemInput[];
  discount?: number;
}


