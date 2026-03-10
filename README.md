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
