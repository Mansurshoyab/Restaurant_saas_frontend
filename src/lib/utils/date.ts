import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

// RestaurantSettings.timezone defaults to 'Asia/Dhaka' on the backend —
// pass the org's actual setting here once useSettings() is wired into
// whatever component calls this, rather than hardcoding.
const DEFAULT_TZ = 'Asia/Dhaka';

export function formatDateTime(isoString: string, timezone = DEFAULT_TZ): string {
  return formatInTimeZone(parseISO(isoString), timezone, 'dd MMM yyyy, hh:mm a');
}

export function formatDate(isoString: string, timezone = DEFAULT_TZ): string {
  return formatInTimeZone(parseISO(isoString), timezone, 'dd MMM yyyy');
}

export function formatTime(isoString: string, timezone = DEFAULT_TZ): string {
  return formatInTimeZone(parseISO(isoString), timezone, 'hh:mm a');
}

export function formatRelative(isoString: string): string {
  return formatDistanceToNow(parseISO(isoString), { addSuffix: true });
}

export function toDateInputValue(isoString: string): string {
  return format(parseISO(isoString), 'yyyy-MM-dd');
}

/** Start/end of "today" in the restaurant's local timezone, as ISO strings for API query params. */
export function todayRange(timezone = DEFAULT_TZ): { from: string; to: string } {
  const now = new Date();
  const from = new Date(now);
  from.setHours(0, 0, 0, 0);
  const to = new Date(now);
  to.setHours(23, 59, 59, 999);
  return { from: from.toISOString(), to: to.toISOString() };
}


