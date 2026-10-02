'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { normalizeApiError } from '@/lib/api/client';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: (failureCount, error) => {
              const normalized = normalizeApiError(error);
              // Never retry 4xx — a validation or auth error won't fix
              // itself by trying again. Only retry network/5xx failures.
              if (normalized.statusCode >= 400 && normalized.statusCode < 500) return false;
              return failureCount < 2;
            },
          },
          mutations: {
            retry: false, // never auto-retry mutations — see idempotency notes in usePayment.ts
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {process.env.NODE_ENV === 'development' && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  );
}


