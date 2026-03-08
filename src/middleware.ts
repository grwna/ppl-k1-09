/**
 * MIDDLEWARE TEMPLATE
 * Use this to protect routes and handle redirects based on auth status.
 */

import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isDashboardRoute = req.nextUrl.pathname.startsWith("/dashboard");

  // If trying to access dashboard but not logged in, redirect to login
  if (isDashboardRoute && !isLoggedIn) {
    console.log("Middleware: Unauthorized access to dashboard. Redirecting...");
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // If already logged in and trying to access login page, redirect to dashboard
  if (isLoggedIn && req.nextUrl.pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
});

// Configure which paths should trigger the middleware
export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
