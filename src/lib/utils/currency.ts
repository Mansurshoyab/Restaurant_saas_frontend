// Backend stores/returns amounts as plain decimal numbers already
// (e.g. 250.5, not 25050 minor units) per money.util.js's roundCurrency
// usage throughout services — NOT the toMinorUnits path, which is only
// used internally for the money.util.js helpers themselves. Confirm
// this matches your actual API responses before relying on it broadly.

export function formatCurrency(amount: number, currencyCode = 'BDT'): string {
  const symbol = currencyCode === 'BDT' ? '৳' : currencyCode;
  return `${symbol}${amount.toLocaleString('en-BD', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatCurrencyCompact(amount: number, currencyCode = 'BDT'): string {
  const symbol = currencyCode === 'BDT' ? '৳' : currencyCode;
  if (amount >= 100000) return `${symbol}${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `${symbol}${(amount / 1000).toFixed(1)}K`;
  return `${symbol}${amount.toFixed(0)}`;
}

export function roundCurrency(amount: number): number {
  return Math.round(amount * 100) / 100;
}


