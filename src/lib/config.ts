// Central place for anything env-driven. Never read process.env directly
// outside this file, so a missing var fails loudly here instead of
// silently producing "undefined" deep in a component.

function requireEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export const config = {
  apiBaseUrl: requireEnv('NEXT_PUBLIC_API_BASE_URL', 'http://localhost:4000/api/v1'),
  r2PublicBaseUrl: process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL ?? '',
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? 'Restaurant SaaS',
} as const;


