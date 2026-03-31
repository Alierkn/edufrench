import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";
import { getNextAuthSecret } from "@/lib/authSecret";

export default withAuth(
  function middleware(req) {
    const path = req.nextUrl.pathname;
    const isAdminRoute = path.startsWith("/admin") || path.startsWith("/studio");
    const token = req.nextauth.token;
    if (isAdminRoute && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  },
  {
    secret: getNextAuthSecret(),
    callbacks: {
      authorized: ({ token }) => Boolean(token),
    },
  }
);

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/ce",
    "/ce/:path*",
    "/co",
    "/co/:path*",
    "/pe",
    "/pe/:path*",
    "/po",
    "/po/:path*",
    "/grammaire",
    "/grammaire/:path*",
    "/vocabulaire",
    "/vocabulaire/:path*",
    "/onboarding",
    "/onboarding/:path*",
    "/admin",
    "/admin/:path*",
    "/studio",
    "/studio/:path*",
  ],
};
