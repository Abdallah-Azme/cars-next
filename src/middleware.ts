import { NextRequest, NextResponse } from "next/server";
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

/**
 * Next.js Edge Middleware — runs on every matched request BEFORE the page renders.
 *
 * Protects /admin/* routes server-side by checking for the auth_token cookie.
 * 
 * Combined with next-intl middleware for locale handling.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Handle locale-prefixed admin routes for protection
  // Pattern: /en/admin, /ar/admin, etc.
  const pathParts = pathname.split('/').filter(Boolean);
  const isLocaleAdmin = pathParts.length >= 2 && routing.locales.includes(pathParts[0]) && pathParts[1] === 'admin';
  const isAdminRoot = pathname.startsWith('/admin');

  if (isLocaleAdmin || isAdminRoot) {
    // If it's a login page (prefixed or not), allow it
    if (pathname.includes('/admin/login')) {
      return intlMiddleware(request);
    }

    const token = request.cookies.get("auth_token")?.value;

    if (!token) {
      // Redirect to login preserving the locale if present
      const locale = routing.locales.includes(pathParts[0]) ? pathParts[0] : routing.defaultLocale;
      const loginUrl = new URL(`/${locale}/admin/login`, request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 2. Apply next-intl middleware for all other cases
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Enable a redirect to a matching locale at the root
    '/',

    // Set a cookie to remember the last locale for these paths
    '/(en|ja|ar|sw)/:path*',

    // Match all pathnames except for
    // - /api (API routes)
    // - /_next (Next.js internals)
    // - /static (static files)
    // - /_vercel (Vercel internals)
    // - All files inside /public (e.g. /favicon.ico)
    '/((?!api|_next|_vercel|.*\\..*).*)'
  ],
};
