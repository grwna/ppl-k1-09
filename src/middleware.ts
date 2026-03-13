import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const roles = (req.auth?.user as any)?.roles || [];
  const pathname = req.nextUrl.pathname;

  const isDashboardRoute = pathname.startsWith("/dashboard");
  const isAdminRoute = pathname.startsWith("/dashboard/admin");
  const isAuthRoute = pathname === "/login" || pathname === "/register";
  const isRootRoute = pathname === "/";

  // 1. Redirect pengguna yang belum login ke login (untuk dashboard & root)
  if ((isDashboardRoute || isRootRoute) && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  // 2. Access Control: Hanya ADMIN yang bisa masuk ke area admin
  if (isAdminRoute && !roles.includes("ADMIN")) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl)); 
  }

  // 3. Jika sudah login, jauhkan dari halaman login/register
  if (isLoggedIn && isAuthRoute) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/", "/dashboard/:path*", "/login", "/register"],
};
