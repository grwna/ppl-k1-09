# Student Loan Management System - Rumah Amal Salman

This document details configurations decisions and explanations for every folders inside the project.

## Folder Structure & Templates

- **`src/actions/`**: Server-side functions for handling form submissions and data mutations (`"use server"`). Always delegate business logic to services.
- **`src/services/`**: The core business logic and data access layer (Prisma/Supabase). Keep these framework-agnostic.
- **`src/app/(public)/`**: Publicly accessible routes (Landing, FAQ, etc.). Shared UI is managed in `(public)/layout.tsx`.
- **`src/app/(dashboard)/`**: Protected/Authenticated routes. Shared UI (sidebars, nav) is managed in `(dashboard)/layout.tsx`.
- **`src/app/api/`**: RESTful API endpoints for external integrations or programmatic access.
- **`src/app/not-found.tsx`**: The global 404 error handler for the application.
- **`src/components/ui/`**: Reusable base UI components (Shadcn/UI).
- **`src/lib/`**: Shared utility functions and third-party client initializations (Prisma, Supabase).
