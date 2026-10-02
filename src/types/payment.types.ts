import type { PaymentMethod } from '@/lib/constants';

export interface PaymentLineInput {
  method: PaymentMethod;
  amount: number;
  amountReceived?: number; // CASH only
  transactionId?: string; // BKASH/NAGAD
  reference?: string;
}

export interface PayOrderPayload {
  orderId: string;
  payments: PaymentLineInput[];
}

export interface Payment {
  _id: string;
  orderId: string;
  method: PaymentMethod;
  amount: number;
  changeGiven: number;
  transactionId: string | null;
  reference: string | null;
  status: 'RECORDED' | 'VOIDED';
  receivedBy: string;
  createdAt: string;
}

export interface RefundPayload {
  orderId: string;
  amount: number;
  method: string;
  reason: string;
}


