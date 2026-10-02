import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Auth state lives in zustand+localStorage, not cookies, so Next.js
// middleware (which runs on the edge, no localStorage access) can't
// actually check "is this user logged in" here. Route protection is
// therefore enforced client-side in each (admin)/(pos) layout.tsx by
// reading useAuthStore and redirecting — this middleware only handles
// the parts that genuinely are edge-appropriate (redirects, headers).
export function proxy(request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};


