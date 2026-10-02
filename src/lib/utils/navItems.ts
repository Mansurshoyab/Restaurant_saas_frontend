import {
  LayoutDashboard,
  ClipboardList,
  UtensilsCrossed,
  Boxes,
  Truck,
  Building2,
  BarChart3,
  Wallet,
  Settings,
  CreditCard,
  Users,
  ShoppingCart,
  ChefHat,
  type LucideIcon,
} from 'lucide-react';
import { PERMISSIONS } from '@/lib/constants';

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  permission?: string;
  external?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Point of Sale', href: '/pos/tables', icon: ShoppingCart, permission: PERMISSIONS.ORDER_CREATE, external: true },
  // NEW — visible to Kitchen Staff even though they can't create orders
  { label: 'Kitchen Queue', href: '/pos/kitchen', icon: ChefHat, permission: PERMISSIONS.ORDER_UPDATE_STATUS, external: true },
  { label: 'Orders', href: '/orders', icon: ClipboardList, permission: PERMISSIONS.ORDER_CREATE },
  // { label: 'Customers', href: '/customers', icon: Users, permission: PERMISSIONS.ORDER_CREATE },
  { label: 'Menu', href: '/menu/products', icon: UtensilsCrossed, permission: PERMISSIONS.SETTINGS_MANAGE },
  { label: 'Inventory', href: '/inventory/items', icon: Boxes, permission: PERMISSIONS.INVENTORY_MANAGE },
  { label: 'Purchasing', href: '/purchasing/orders', icon: Truck, permission: PERMISSIONS.PURCHASE_MANAGE },
  { label: 'Restaurant', href: '/restaurant/staff', icon: Building2, permission: PERMISSIONS.USER_MANAGE },
  { label: 'Reports', href: '/reports/sales', icon: BarChart3, permission: PERMISSIONS.REPORT_VIEW },
  { label: 'Expenses', href: '/expenses', icon: Wallet, permission: PERMISSIONS.REPORT_VIEW },
  { label: 'Settings', href: '/settings/restaurant', icon: Settings, permission: PERMISSIONS.SETTINGS_MANAGE },
  { label: 'Subscription', href: '/subscription', icon: CreditCard, permission: PERMISSIONS.SETTINGS_MANAGE },
];