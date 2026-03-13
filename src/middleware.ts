/**
 * MIDDLEWARE TEMPLATE
 * Use this to protect routes and handle redirects based on auth status.
 */

import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;
  const pathname = req.nextUrl.pathname;

  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAdminRoute = pathname.startsWith("/dashboard/admin");
  const isLoginRoute = pathname === "/login" || pathname === "/register";

  // Redirect pengguna yang belum login ke halaman login
  if (isDashboardRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // Access Control: Cegah akses selain Admin untuk rute admin
  if (isAdminRoute && userRole !== "ADMIN") {
    // Arahkan ke dashboard umum jika memaksa masuk area admin
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl)); 
  }

  // Arahkan pengguna yang sudah login menjauhi halaman autentikasi
  if (isLoggedIn && isLoginRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }
    const isLoggedIn = !!req.auth;
    // const isLoggedIn = !!req.auth?.user;
    const isDashboardRoute = req.nextUrl.pathname.startsWith("/dashboard");
    const isRootRoute = req.nextUrl.pathname === "/";


    // If trying to access dashboard but not logged in, redirect to login
    if ((isDashboardRoute || isRootRoute) && !isLoggedIn) {
        console.log("Middleware: Unauthorized access to dashboard. Redirecting...");
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    // If already logged in and trying to access login page, redirect to dashboard
    if (isLoggedIn && req.nextUrl.pathname === "/login") {
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }

    return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/register", "/((?!api|_next/static|_next/image|favicon.ico|public).*)"],
    matcher: ["/dashboard/:path*", "/login"],
};
