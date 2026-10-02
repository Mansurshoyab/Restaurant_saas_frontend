# Restaurant SaaS — Frontend

Next.js 14 (App Router) + TypeScript + Tailwind frontend for the Restaurant SaaS POS/Inventory platform. Consumes the backend REST API documented in the system design.

## Setup

\`\`\`bash
npm install
cp .env.local.example .env.local
# fill in NEXT_PUBLIC_API_BASE_URL to point at your running backend
npm run dev
\`\`\`

## Structure

- `src/app/(auth)` — login, register, OTP, forgot password
- `src/app/(pos)` — full-screen POS terminal: tables, cart, payment, kitchen queue, shifts
- `src/app/(admin)` — back-office: menu, inventory, purchasing, staff, reports, settings, subscription
- `src/lib/api` — typed API client functions, one file per backend module
- `src/lib/hooks` — React Query hooks wrapping the API layer
- `src/lib/stores` — Zustand stores for client-only state (auth tokens, POS cart, UI prefs)

## Known gaps

- Forgot-password flow cannot complete: the backend has no endpoint to set a new password after OTP verification without the old password. Needs a backend addition (`POST /auth/reset-password`) before this is fully functional.
- No dedicated `/reports/purchases` backend endpoint exists; the purchasing report page aggregates client-side from `GET /purchases` instead.
- Route protection is enforced client-side in each layout (`useAuthStore` + redirect), not in Next.js middleware, since auth state lives in localStorage rather than cookies.
- Nothing in this frontend has been run against a live backend yet — treat first integration testing as the next required step, not an afterthought.


