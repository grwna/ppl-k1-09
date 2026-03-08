/**
 * AUTH.JS ROUTE HANDLER TEMPLATE
 * Exposes the standard auth endpoints (e.g. /api/auth/signin, /api/auth/callback/google, etc.)
 * based on the configuration in src/auth.ts
 */

import { handlers } from "@/auth";

export const { GET, POST } = handlers;
