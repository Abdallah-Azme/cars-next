import { NextRequest, NextResponse } from "next/server";

/**
 * Next.js Edge Middleware — runs on every matched request BEFORE the page renders.
 *
 * Protects /admin/* routes server-side by checking for the auth_token cookie.
 * Without this, protection is purely client-side (Zustand localStorage) which:
 *  1. Causes a visible flash/redirect on every page load.
 *  2. Can be bypassed by clearing JS state.
 *
 * NOTE: This server runs over plain HTTP (no domain, no SSL).
 *       Do NOT use `secure` flag on cookies here — Edge middleware reads
 *       httpOnly cookies via request.cookies which works fine on HTTP.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow the admin login page through (no auth needed)
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // Protect all /admin/* routes
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      // No token — redirect to admin login
      const loginUrl = new URL("/admin/login", request.url);
      // Preserve the intended destination for post-login redirect
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all /admin/* routes, excluding static files and Next.js internals
    "/admin/:path*",
  ],
};
