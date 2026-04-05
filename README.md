# Student Loan Management System - Rumah Amal Salman

This document details configurations decisions and explanations for every folders inside the project.

## Folder Structure & Templates

- **`src/actions/`**: Server-side functions for handling form submissions and data mutations (`"use server"`). Always delegate business logic to services.
- **`src/services/`**: The core business logic and data access layer (Prisma/Supabase). Keep these framework-agnostic.
- **`src/app/(public)/`**: Publicly accessible routes (Landing, FAQ, etc.). Shared UI is managed in `(public)/layout.tsx`.
- **`src/app/(dashboard)/`**: Protected/Authenticated routes. Shared UI (sidebars, nav) is managed in `(dashboard)/layout.tsx`.
- **`src/app/api/`**: RESTful API endpoints for external integrations or programmatic access.
- **`src/app/not-found.tsx`**: The global 404 error handler for the application.
- **`src/auth.ts`**: The central configuration for **Auth.js (NextAuth v5)**. Define providers, callbacks, and Prisma adapter here.
- **`src/middleware.ts`**: Global middleware for route protection and authentication-based redirects.
- **`src/app/api/auth/[...nextauth]/route.ts`**: The API route handler for authentication endpoints.
- **`src/schemas/`**: Centralized **Zod schemas** for data validation, form inputs, and type safety.
- **`prisma/schema.prisma`**: The single source of truth for the **database schema**.
- **`src/components/ui/`**: Reusable base UI components (Shadcn/UI).
- **`src/lib/`**: Shared utility functions and third-party client initializations (Prisma, Supabase).

## CI Workflow
Runs automatically on every push or pull request to `main`, `master`, and `dev` branches. What it does:
- **Checkout Code** — Clones the repository into the runner.
- **Setup Node.js** — Installs Node.js 20 and caches npm dependencies for faster subsequent runs.
- **Install Dependencies** — Clean, deterministic install from `package-lock.json` via `npm ci`.
- **Prisma Generate** — Generates the Prisma client from the schema, required before type-checking or building.
- **Linting** — Runs ESLint on `src/` only, skipping library-generated code. (Currently disabled)
- **Type Check** — Runs `tsc --noEmit` to catch type errors without emitting output files.
- **Build Check** — Runs `next build` to verify the production build compiles successfully.

## Midtrans Payment Setup (QRIS + VA)

The project now uses **Midtrans Core API** for two payment methods only:
- **QRIS**
- **Virtual Account (VA)**

Both payment methods are rendered directly in our app:
- QRIS shows the QR image inside the payment confirmation page.
- VA shows the VA number and bank details inside the payment confirmation page.

### Required Environment Variables

Set these variables in `.env`:

Start quickly by copying the template:

`cp .env.example .env`

```env
MIDTRANS_SERVER_KEY=Mid-server-xxxx
MIDTRANS_CLIENT_KEY=Mid-client-xxxx
MIDTRANS_ENVIRONMENT=sandbox
MIDTRANS_CALLBACK_URL=http://localhost:3000/api/payments/midtrans/notification
MIDTRANS_EXPIRY_MINUTES=2
MIDTRANS_DEV_FALLBACK_POLLING=false
NEXTAUTH_URL=http://localhost:3000
```

`MIDTRANS_EXPIRY_MINUTES` controls charge expiration for QRIS and VA (use a very short value such as `1` or `2` for testing).
`MIDTRANS_DEV_FALLBACK_POLLING` is a local developer toggle. When set to `true`, the confirmation page's live update stream will occasionally reconcile pending payments directly with Midtrans if webhook delivery is not reaching the local machine. Leave it `false` for normal webhook-first behavior.

### API Endpoints

- `POST /api/payments/midtrans/payments` → create QRIS/VA transaction
- `GET /api/payments/midtrans/status/[orderId]` → poll transaction status
- `POST /api/payments/midtrans/notification` → Midtrans webhook callback
- `POST /api/payments/midtrans/simulate` → sandbox simulation helper

### Payment Auth

`POST /api/payments/midtrans/payments` is session-only.

- The request must come from a logged-in user in this app.
- Postman or `curl` will only work if they first obtain and send a valid app session cookie.
- Donation requests always use the logged-in user as the donor reference.
- Repayment requests are checked against the logged-in borrower before a charge is created.

### Midtrans Dashboard Configuration

In Midtrans dashboard (sandbox or production), set **Payment Notification URL** to:

`<your-domain>/api/payments/midtrans/notification`

Example local tunnel URL:

`https://<your-tunnel-domain>/api/payments/midtrans/notification`

### Local Testing Flow

1. Run the app with `npm run dev`.
2. Open payment flow (e.g. `/payment?...`) and choose either:
	- `QRIS`: verify QR image appears on `/payment/confirm`.
	- `VA`: verify VA number + bank info appears on `/payment/confirm`.
3. In sandbox mode, use the **Simulate Payment (Sandbox)** button on confirm page.
4. Confirm status changes to `SETTLEMENT` in UI and `payment_transactions` table.

### Notes

- Minimum QRIS amount is **IDR 1,500**.
- For VA, supported banks in this implementation are **BCA, BNI, BRI, Permata, CIMB, Mandiri Bill**.
- `referenceId` is required and must be UUID, but it is not pre-validated against existing business records during create payment.
- For full payment architecture, callback fulfillment flow, and schema behavior, see `MIDTRANS_BACKEND_API.md`.
