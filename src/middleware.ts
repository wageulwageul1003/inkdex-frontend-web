import { NextRequest, NextResponse } from 'next/server';

import { ACCESS_TOKEN } from './constants/tokens';

// Define route patterns
const noAuthRoutes = [
  // Routes that should redirect to main page if user is logged in
  /\/login(\/.*)?$/,
  /\/register(\/.*)?$/,
];

const protectedRoutes = [
  // Add your protected routes here that require authentication
  /\/mypage(\/.*)?$/,
];

export async function middleware(request: NextRequest) {
  // Check for authentication cookie
  const isLoggedIn = request.cookies.has(ACCESS_TOKEN);

  // Get the pathname without locale prefix
  const pathname = request.nextUrl.pathname;

  // Extract locale from URL if present
  const pathnameWithoutLocale = pathname;

  // Check if the request is for a no-auth route (login/register)
  const isNoAuthRoute = noAuthRoutes.some((pattern) =>
    pattern.test(pathnameWithoutLocale),
  );

  // Check if the request is for a protected route
  const isProtectedRoute = protectedRoutes.some((pattern) =>
    pattern.test(pathnameWithoutLocale),
  );

  // Rule 4: If user accesses a no-auth page (login/register)
  if (isNoAuthRoute) {
    // Rule 4.2: If logged in, redirect to main page
    if (isLoggedIn) {
      // Extract locale from URL or use default
      return NextResponse.redirect(new URL(`/home`, request.url));
    }
    // Rule 4.1: If not logged in, allow access (handled by intlMiddleware)
  }

  // Rule 5: If user accesses a protected route
  if (isProtectedRoute) {
    // Rule 5.1: If not logged in, redirect to login page
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL(`/login`, request.url));
    }
    // Rule 5.2: If logged in, allow access (handled by intlMiddleware)
  }

  // Apply locale middleware, excluding specific paths
  if (
    !pathname.startsWith('/api') &&
    !pathname.startsWith('/_next') &&
    !pathname.includes('/favicon.ico')
  ) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  // Skip all paths that should not be internationalized
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
