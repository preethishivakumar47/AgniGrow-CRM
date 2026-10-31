import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookieName = process.env.AUTH_COOKIE_NAME || "agni_crm_session";
  const sessionToken = request.cookies.get(cookieName)?.value;

  const protectedRoutes = [
    "/dashboard",
    "/leads",
    "/pipeline",
    "/tasks",
    "/contacts",
    "/accounts",
    "/quotes",
    "/reports",
    "/settings",
  ];
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));

  // If trying to access protected route without session
  if (isProtected && !sessionToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // If already authenticated and accessing /login, send to /dashboard
  if (pathname === "/login" && sessionToken) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/leads/:path*",
    "/pipeline/:path*",
    "/tasks/:path*",
    "/contacts/:path*",
    "/accounts/:path*",
    "/quotes/:path*",
    "/reports/:path*",
    "/settings/:path*",
    "/login",
  ],
};
