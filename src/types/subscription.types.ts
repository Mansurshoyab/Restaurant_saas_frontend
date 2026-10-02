import type { SubscriptionStatus } from '@/lib/constants';

export interface Plan {
  _id: string;
  name: string;
  key: string;
  billingCycle: 'MONTHLY' | 'YEARLY';
  price: number;
  features: string[];
  isActive: boolean;
}

export interface Subscription {
  _id: string;
  organizationId: string;
  planId: Plan | string | null;
  plan: 'MONTHLY' | 'YEARLY';
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  amount: number;
}

export interface SubscriptionRequest {
  _id: string;
  organizationId: string;
  planId: Plan | string;
  amount: number;
  transactionId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason: string | null;
  createdAt: string;
}

export interface SubmitPaymentRequestInput {
  planId: string;
  senderBkashNumber: string;
  transactionId: string;
  screenshot?: File;
}


