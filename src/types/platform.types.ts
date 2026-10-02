export interface PlatformStats {
  organizations: {
    total: number;
    active: number;
    suspended: number;
  };
  revenue: {
    last30Days: number;
  };
  expiringSubscriptions: number;
}

export interface PlatformUsageItem {
  date: string;
  gmv: number;
  orders: number;
}

export interface PlatformUsage {
  history: PlatformUsageItem[];
}

export interface PlatformOrganizationRow {
  _id: string;
  name: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'INACTIVE';
  subscriptionStatus: 'ACTIVE' | 'TRIAL' | 'EXPIRED' | 'NONE';
  branchCount: number;
  userCount: number;
  createdAt: string;
}

export interface OrganizationDetail {
  organization: PlatformOrganizationRow & { email?: string; phone?: string; ownerName?: string };
  branches: Array<{ _id: string; name: string; address?: string }>;
  users: Array<{ _id: string; name: string; roleId?: string }>;
  subscriptions: Array<{
    _id: string;
    plan: { name: string };
    startDate: string;
    endDate: string;
    status: string;
  }>;
  usage: {
    totalOrders: number;
    totalRevenue: number;
  };
}

export interface Plan {
  _id: string;
  name: string;
  key: string;
  billingCycle: 'MONTHLY' | 'YEARLY';
  price: number;
  limits: {
    branches: number;
    users: number;
  };
  features: string[];
  isActive: boolean;
  sortOrder: number;
}

export interface SubscriptionRequest {
  _id: string;
  organizationId: string;
  planId: string;
  amount: number;
  senderBkashNumber?: string;
  transactionId?: string;
  screenshotUrl?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  createdAt: string;
  organization?: { name: string };
  plan?: { name: string };
}
