import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const isAdmin = token?.role === "ADMIN" || token?.role === "SUPER_ADMIN";
    const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");
    const isLoginPage = req.nextUrl.pathname === "/admin/login";

    // If user is authenticated and tries to access login page, redirect to dashboard
    if (isLoginPage && isAdmin) {
      return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    }

    // If user is not admin and tries to access admin routes, redirect to login
    if (isAdminRoute && !isAdmin) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    },
    pages: {
      signIn: "/admin/login",
    }
  }
);

// Protect all routes under /admin
export const config = {
  matcher: ["/admin/:path*"]
}; 