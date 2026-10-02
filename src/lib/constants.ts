export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ORG_ADMIN: 'ORG_ADMIN',
  BRANCH_MANAGER: 'BRANCH_MANAGER',
  CASHIER: 'CASHIER',
  WAITER: 'WAITER',
  INVENTORY_MANAGER: 'INVENTORY_MANAGER',
  PURCHASE_MANAGER: 'PURCHASE_MANAGER',
  KITCHEN: 'KITCHEN',
  ACCOUNTANT: 'ACCOUNTANT',
} as const;

export const ORDER_TYPE = {
  DINE_IN: 'DINE_IN',
  TAKEAWAY: 'TAKEAWAY',
  DELIVERY: 'DELIVERY',
  ONLINE: 'ONLINE',
  PHONE_ORDER: 'PHONE_ORDER',
} as const;

export const ORDER_STATUS = {
  DRAFT: 'DRAFT',
  CONFIRMED: 'CONFIRMED',
  PREPARING: 'PREPARING',
  READY: 'READY',
  SERVED: 'SERVED',
  PICKED_UP: 'PICKED_UP',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED',
} as const;

export const PAYMENT_STATUS = {
  UNPAID: 'UNPAID',
  PARTIALLY_PAID: 'PARTIALLY_PAID',
  PAID: 'PAID',
  REFUNDED: 'REFUNDED',
} as const;

export const PAYMENT_METHOD = {
  CASH: 'CASH',
  CARD: 'CARD',
  BKASH: 'BKASH',
  NAGAD: 'NAGAD',
  OTHER: 'OTHER',
} as const;

export const STOCK_TX_TYPE = {
  OPENING_STOCK: 'OPENING_STOCK',
  PURCHASE: 'PURCHASE',
  SALE_CONSUMPTION: 'SALE_CONSUMPTION',
  WASTE: 'WASTE',
  STOCK_ADJUSTMENT: 'STOCK_ADJUSTMENT',
  TRANSFER_OUT: 'TRANSFER_OUT',
  TRANSFER_IN: 'TRANSFER_IN',
  RETURN: 'RETURN',
  PRODUCTION: 'PRODUCTION',
} as const;

export const PURCHASE_STATUS = {
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  APPROVED: 'APPROVED',
  PARTIALLY_RECEIVED: 'PARTIALLY_RECEIVED',
  RECEIVED: 'RECEIVED',
} as const;

export const SUBSCRIPTION_STATUS = {
  TRIAL: 'TRIAL',
  ACTIVE: 'ACTIVE',
  EXPIRED: 'EXPIRED',
  SUSPENDED: 'SUSPENDED',
  CANCELLED: 'CANCELLED',
} as const;

export const INVENTORY_UNIT = {
  KG: 'kg',
  G: 'g',
  LITER: 'liter',
  ML: 'ml',
  PIECE: 'piece',
  PACKET: 'packet',
  BOX: 'box',
  BOTTLE: 'bottle',
} as const;

export const POS_SHIFT_STATUS = {
  OPEN: 'OPEN',
  CLOSED: 'CLOSED',
} as const;

// Mirrors the permission keys seeded in scripts/seed.js — used by
// usePermissions.ts to gate UI, NOT a real security boundary (the
// backend's authorize() middleware is the actual gate).
export const PERMISSIONS = {
  ORDER_CREATE: 'order:create',
  ORDER_CANCEL: 'order:cancel',
  ORDER_UPDATE_STATUS: 'order:update_status', // NEW
  PAYMENT_RECORD: 'payment:record',
  INVENTORY_MANAGE: 'inventory:manage',
  PURCHASE_MANAGE: 'purchase:manage',
  REPORT_VIEW: 'report:view',
  USER_MANAGE: 'user:manage',
  SETTINGS_MANAGE: 'settings:manage',
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];
export type OrderType = (typeof ORDER_TYPE)[keyof typeof ORDER_TYPE];
export type OrderStatus = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];
export type PaymentStatus = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];
export type PaymentMethod = (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];
export type StockTxType = (typeof STOCK_TX_TYPE)[keyof typeof STOCK_TX_TYPE];
export type PurchaseStatus = (typeof PURCHASE_STATUS)[keyof typeof PURCHASE_STATUS];
export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUS)[keyof typeof SUBSCRIPTION_STATUS];
export type InventoryUnit = (typeof INVENTORY_UNIT)[keyof typeof INVENTORY_UNIT];
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];


