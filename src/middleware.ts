import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth({
    ...authConfig,
    secret: process.env.AUTH_SECRET,
});

export default auth((req) => {
    const isLoggedIn = !!req.auth?.user;
    const roles = (req.auth?.user as any)?.roles || [];
    const pathname = req.nextUrl.pathname;

    const isDashboardRoute = pathname.startsWith("/dashboard");
    const isAdminRoute = pathname.startsWith("/dashboard/admin");
    const isAuthRoute = pathname === "/login" || pathname === "/register" || pathname === "/sign-up";
    const isRootRoute = pathname === "/";
    const isLoggedInRoute = pathname === "/logged-in";

    const getRoleDashboardPath = () => {
        if (roles.includes("DONOR")) return "/donor/dashboard";
        if (roles.includes("ADMIN")) return "/dashboard";
        if (roles.includes("BORROWER")) return "/applicant/dashboard";
        return "/donor/dashboard";
    };

    // 1. Redirect pengguna yang belum login ke login (untuk dashboard & root & logged-in)
    if ((isDashboardRoute || isLoggedInRoute) && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    // 2. Access Control: Hanya ADMIN yang bisa masuk ke area admin
    if (isAdminRoute && !roles.includes("ADMIN")) {
        return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }

    // 3. Jika sudah login, jauhkan dari halaman login/register/sign-up
    if (isLoggedIn && isAuthRoute) {
        return NextResponse.redirect(new URL(getRoleDashboardPath(), req.nextUrl));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/", "/dashboard/:path*", "/login", "/register", "/sign-up", "/logged-in"],
};
