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

    const isDonorRoute = pathname.startsWith("/donor");
    const isAdminRoute = pathname.startsWith("/admin");
    const isApplicantRoute = pathname.startsWith("/applicant");
    const isAuthRoute = pathname === "/login" || pathname === "/register" || pathname === "/sign-up";
    const isRootRoute = pathname === "/";
    const isLoggedInRoute = pathname === "/logged-in";

    const getRoleDashboardPath = () => {
        if (roles.includes("ADMIN")) return "/admin/dashboard";
        if (roles.includes("DONOR")) return "/donor/dashboard";
        if (roles.includes("BORROWER")) return "/applicant/dashboard";
        return "/donor/dashboard";
    };

    // 1. Redirect pengguna yang belum login ke login (untuk area terproteksi)
    if ((isDonorRoute || isAdminRoute || isApplicantRoute || isLoggedInRoute) && !isLoggedIn) {
        return NextResponse.redirect(new URL("/login", req.nextUrl));
    }

    // 2. Access Control: Pastikan role sesuai dengan prefix route
    if (isAdminRoute && !roles.includes("ADMIN")) {
        return NextResponse.redirect(new URL(getRoleDashboardPath(), req.nextUrl));
    }
    if (isDonorRoute && !roles.includes("DONOR") && !roles.includes("ADMIN")) {
        return NextResponse.redirect(new URL(getRoleDashboardPath(), req.nextUrl));
    }

    // 3. Jika sudah login, jauhkan dari halaman auth atau redirect dari root
    if (isLoggedIn && (isAuthRoute || isRootRoute || isLoggedInRoute)) {
        return NextResponse.redirect(new URL(getRoleDashboardPath(), req.nextUrl));
    }

    return NextResponse.next();
});

export const config = {
    matcher: ["/", "/admin/:path*", "/donor/:path*", "/applicant/:path*", "/login", "/register", "/sign-up", "/logged-in"],
};
