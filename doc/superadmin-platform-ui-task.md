```tsx

TASK: Add a SuperAdmin (Platform Admin) UI to the existing Restaurant SaaS frontend,
routed to automatically based on the isSuperAdmin flag returned at login.

You have access to our Postman collection covering /platform/* endpoints. Use it as
the source of truth for request/response shapes — do not guess field names.

============================================================
1. LOGIN REDIRECT LOGIC (do this first, it's the entry point)
============================================================

Our JWT access token payload already includes `isSuperAdmin: boolean` (see
src/types/auth.types.ts -> AccessTokenPayload). The authStore
(src/lib/stores/authStore.ts) already decodes this on login via setTokens().

Update every place that currently does `router.push('/dashboard')` after a
successful login/register/OTP-verify to instead check the decoded user and
branch:

  - src/app/(auth)/login/page.tsx
  - src/app/(auth)/otp/page.tsx
  - src/app/(auth)/register/page.tsx  (registration always creates an
    OrgAdmin, never a SuperAdmin — this one can stay as-is, but confirm)

Pattern to use in each:
  const user = useAuthStore((s) => s.user); // or read the mutation result
  router.push(user?.isSuperAdmin ? '/platform/dashboard' : '/dashboard');

Since useLogin/useVerifyOtp already call setTokens() in their onSuccess (which
populates the store), the cleanest approach is to read
useAuthStore.getState().user immediately after the mutateAsync() call
resolves in each page's handleSubmit, rather than relying on a stale
closure value from before the mutation ran.

Also update src/app/page.tsx (the root redirect) and the two layout guards
(src/app/(admin)/layout.tsx and src/app/(pos)/layout.tsx) so that:
  - A SuperAdmin who somehow lands on /dashboard or /pos/* is redirected to
    /platform/dashboard instead of being shown the restaurant UI.
  - A non-SuperAdmin who tries to hit any /platform/* route is redirected to
    /dashboard (build this check into the new (platform) layout, see below).

============================================================
2. NEW ROUTE GROUP: src/app/(platform)/
============================================================

Create a new Next.js route group, structurally parallel to (admin) and (pos).
Reuse the SAME conventions already established in this codebase:
  - Same Card/Button/Input/Select/Checkbox/Badge/Dialog primitives from
    src/components/ui/
  - Same DataTable, PageHeader, LoadingSpinner, EmptyState, ConfirmDialog
    from src/components/shared/
  - Same React Query + axios pattern: typed API client function in
    src/lib/api/, wrapped by a hook in src/lib/hooks/, called from a page.
  - Same normalizeApiError() + toast.error() pattern for error handling.
  - Same CurrencyDisplay, formatDate/formatDateTime/formatRelative utils.

Do NOT reuse AdminSidebar/AdminTopbar/PosTopbar as-is — build a distinct
PlatformSidebar/PlatformTopbar so the SuperAdmin UI is visually and
structurally distinguishable from the restaurant-facing app (different org
context entirely — SuperAdmin operates across tenants, not within one).

File structure to create:

src/app/(platform)/
├── layout.tsx                          # guards: authenticated AND isSuperAdmin,
│                                        # else redirect to /login or /dashboard.
│                                        # Renders PlatformSidebar + PlatformTopbar.
├── platform/
│   ├── dashboard/page.tsx              # GET /platform/stats + GET /platform/usage
│   ├── organizations/
│   │   ├── page.tsx                    # GET /platform/organizations (paginated list,
│   │   │                                 filter by status/subscriptionStatus/search)
│   │   └── [organizationId]/page.tsx   # GET /platform/organizations/:id
│   │                                    # shows org detail + branches + users +
│   │                                    # subscriptions + usage stats from the
│   │                                    # response; includes a status-change action
│   │                                    # (PATCH /platform/organizations/:id/status)
│   │                                    # via a ConfirmDialog (suspend/reactivate)
│   ├── plans/
│   │   ├── page.tsx                    # GET /platform/plans (list, incl. inactive
│   │   │                                 toggle), inline create form
│   │   │                                # POST /platform/plans
│   │   └── [planId]/page.tsx           # PATCH /platform/plans/:id (edit),
│   │                                    # DELETE /platform/plans/:id (deactivate)
│   └── subscriptions/
│       ├── requests/
│       │   ├── page.tsx                # GET /platform/subscription-requests
│       │   │                            (pending queue, oldest first)
│       │   └── [requestId]/page.tsx    # GET /platform/subscription-requests/:id
│       │                                # shows submitted TrxID, sender bKash
│       │                                # number, screenshot if present, and the
│       │                                # organization/plan it's for. Approve/
│       │                                # Reject buttons call
│       │                                # POST /platform/subscription-requests/:id/review
│       │                                # with { action: "APPROVE" } or
│       │                                # { action: "REJECT", rejectionReason }.
│       │                                # MUST send an Idempotency-Key header
│       │                                # (use generateIdempotencyKey() from
│       │                                # src/lib/utils/idempotency.ts) since the
│       │                                # backend route is wrapped in
│       │                                # idempotent('review-subscription-request').
│       └── verify/page.tsx             # Manual fallback form calling
│                                        # POST /platform/subscriptions/verify-payment
│                                        # directly (organizationId, planId, amount,
│                                        # paymentReference, periodDays, notes) — for
│                                        # cases where the SuperAdmin verifies a
│                                        # payment that was never submitted as a
│                                        # request. Also needs an Idempotency-Key
│                                        # header per the backend route.

============================================================
3. NEW API / HOOKS / TYPES FILES
============================================================

Follow the exact same layering already used everywhere else in this codebase
(see src/lib/api/purchases.api.ts + src/lib/hooks/usePurchases.ts as the
reference pattern to copy).

src/types/platform.types.ts
  - PlatformStats (mirror GET /platform/stats response exactly, check Postman)
  - PlatformUsage
  - PlatformOrganizationRow (list row shape from GET /platform/organizations,
    including nested subscription/branchCount/userCount as returned)
  - OrganizationDetail (GET /platform/organizations/:id response: organization,
    branches[], users[], subscriptions[], usage)
  - Plan (name, key, billingCycle, price, limits, features, isActive, sortOrder)
  - SubscriptionRequest (organizationId, planId, amount, senderBkashNumber,
    transactionId, screenshotUrl, status, rejectionReason, createdAt)

src/lib/api/platform.api.ts
  - getStats()
  - getUsage(params?: { from?, to? })
  - listPlans(params?: { includeInactive? })
  - createPlan(payload)
  - updatePlan(id, payload)
  - deactivatePlan(id)
  - listOrganizations(params: { status?, subscriptionStatus?, search?, page?, limit? })
  - getOrganizationDetail(id)
  - updateOrganizationStatus(id, payload: { status, reason })
  - listPendingSubscriptionRequests()
  - getSubscriptionRequestDetail(id)
  - reviewSubscriptionRequest(id, payload: { action, rejectionReason? }, idempotencyKey)
  - verifySubscriptionPayment(payload, idempotencyKey)

  Every function follows the existing pattern exactly:
    apiClient.get<ApiResponse<T>>('/platform/...').then((r) => r.data.data)

src/lib/hooks/usePlatform.ts
  - usePlatformStats()
  - usePlatformUsage(params?)
  - usePlatformPlans(params?)
  - useCreatePlatformPlan() / useUpdatePlatformPlan() / useDeactivatePlatformPlan()
  - usePlatformOrganizations(params?)
  - usePlatformOrganizationDetail(id)
  - useUpdateOrganizationStatus()
  - usePendingSubscriptionRequests()
  - useSubscriptionRequestDetail(id)
  - useReviewSubscriptionRequest()   # generates idempotency key internally,
                                        same pattern as usePayOrder() in
                                        src/lib/hooks/usePayment.ts
  - useVerifySubscriptionPayment()   # same idempotency pattern

  Invalidate the right query keys on mutation success:
    - plan mutations -> invalidate ['platform', 'plans']
    - org status change -> invalidate ['platform', 'organizations']
    - review/verify -> invalidate ['platform', 'subscription-requests'] AND
      ['platform', 'organizations'] (since approval changes org status too)

============================================================
4. PLATFORM LAYOUT COMPONENTS
============================================================

src/components/platform/PlatformSidebar.tsx
  Nav items (all always visible — there is no permission-gating on the
  SuperAdmin side, isSuperAdmin is binary):
    - Dashboard        -> /platform/dashboard
    - Organizations     -> /platform/organizations
    - Plans             -> /platform/plans
    - Subscription Requests -> /platform/subscriptions/requests
  Visually distinct from AdminSidebar — e.g. a dark header bar or a
  "PLATFORM" label/badge so nobody confuses this for a tenant's own admin
  panel. Reuse the app's existing color tokens (brand, ink, slate) rather
  than inventing a new palette.

src/components/platform/PlatformTopbar.tsx
  Shows the SuperAdmin's name/email and a logout button (reuse useLogout()
  from src/lib/hooks/useAuth.ts — no changes needed there).

src/app/(platform)/layout.tsx
  'use client';
  Guard logic (mirror the pattern in src/app/(admin)/layout.tsx exactly,
  just with an added isSuperAdmin check):

    const isAuthenticated = useAuthStore((s) => !!s.accessToken);
    const isSuperAdmin = useAuthStore((s) => s.user?.isSuperAdmin);
    const isHydrated = useAuthStore((s) => s.isHydrated);

    useEffect(() => {
      if (!isHydrated) return;
      if (!isAuthenticated) return router.replace('/login');
      if (!isSuperAdmin) return router.replace('/dashboard');
    }, [isHydrated, isAuthenticated, isSuperAdmin, router]);

    if (!isHydrated || !isAuthenticated || !isSuperAdmin) return null;

    return (
      <div className="flex h-screen overflow-hidden">
        <PlatformSidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <PlatformTopbar />
          <main className="flex-1 overflow-y-auto bg-app p-6">{children}</main>
        </div>
      </div>
    );

============================================================
5. PAGE-LEVEL BUILD NOTES
============================================================

/platform/dashboard:
  Two stat cards row (organizations.total/active/suspended, revenue.last30Days)
  plus a "subscriptions expiring within 7 days" callout if that count > 0,
  linking to /platform/subscriptions/requests. Use the same
  SalesSummaryCards-style layout pattern already in
  src/components/reports/SalesSummaryCards.tsx as visual inspiration but
  build a platform-specific version since the data shape is different.

/platform/organizations (list):
  DataTable with columns: Name, Status badge, Subscription status badge,
  Branches, Users, [row click -> detail page]. Filter controls above the
  table: status dropdown, subscription status dropdown, search input
  (debounce not required, keep it simple — trigger on submit or onChange
  is fine given existing patterns elsewhere in this app don't debounce
  either).

/platform/organizations/[organizationId] (detail):
  Sections: org info card, branches list, staff list (reuse DataTable),
  subscription history list, usage stats card (totalOrders, totalRevenue).
  A "Suspend" or "Reactivate" button (based on current status) opens the
  existing ConfirmDialog component asking for a reason (reason is required
  by the backend), then calls useUpdateOrganizationStatus().

/platform/plans:
  Simple list + inline create form (mirror the exact pattern already used
  in src/app/(admin)/menu/categories/page.tsx — inline form toggle, same
  structure). Deactivate button per row wrapped in ConfirmDialog since the
  backend blocks deactivation if organizations are actively subscribed
  (surface that error message from normalizeApiError() if it happens).

/platform/subscriptions/requests (list):
  DataTable of PENDING requests only, oldest first (matches backend's
  default sort). Row click -> detail page.

/platform/subscriptions/requests/[requestId] (detail):
  Show all submitted fields plus the screenshot image if screenshotUrl is
  present (render as <img>, not next/image, since it's an R2 URL not
  covered by next.config.js image domains unless you add it — simplest is
  a plain <img> tag here). Two buttons: Approve (green), Reject (opens a
  small dialog asking for rejectionReason, required). Both call
  useReviewSubscriptionRequest() with the appropriate action. After
  success, redirect back to the requests list.

/platform/subscriptions/verify (manual fallback):
  A simple form: organization picker (fetch via listOrganizations with a
  large limit, or add a search-as-you-type — keep it simple, a plain
  <select> populated from the org list is fine for v1), plan picker (from
  listPlans), amount, paymentReference, periodDays (default 30), notes.
  Submits to useVerifySubscriptionPayment().

============================================================
6. WHAT NOT TO BREAK
============================================================

- Do not modify any existing (admin) or (pos) route, component, hook, or
  API file except the specific login-redirect lines named in section 1.
- Do not change authStore's shape — only read the existing isSuperAdmin
  field, don't add new fields to the store for this feature.
- Do not reuse PERMISSIONS-based gating anywhere in the (platform) route
  group — SuperAdmin access is binary (isSuperAdmin true/false), not
  permission-based, and there is no equivalent of usePermissions() needed
  here.
- Every new API call must go through the existing apiClient instance
  (src/lib/api/client.ts) so the existing auth-token and 401-refresh
  interceptors apply unchanged — do not create a second axios instance.

============================================================
7. VERIFICATION CHECKLIST BEFORE CONSIDERING THIS DONE
============================================================

1. Log in as a normal OrgAdmin -> lands on /dashboard, /platform/* redirects
   to /dashboard if visited manually.
2. Log in as a SuperAdmin (created via scripts/createSuperAdmin.js) -> lands
   on /platform/dashboard, /dashboard and /pos/* redirect to
   /platform/dashboard if visited manually.
3. Every /platform/* page loads without console errors against the real
   backend (not mocked) — confirm using the provided Postman collection's
   request/response shapes as ground truth.
4. Approve and Reject actions on a subscription request actually change
   its status and are reflected without a manual page refresh (query
   invalidation working).
5. Idempotency-Key header is present on both the review and verify-payment
   requests (check Network tab).
   

```
