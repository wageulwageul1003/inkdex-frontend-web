import { NextRequest, NextResponse } from 'next/server';

import { ACCESS_TOKEN } from './constants/tokens';

const noAuthRoutes = [/\/login(\/.*)?$/, /\/.*login.*$/, /\/register(\/.*)?$/];

export async function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.has(ACCESS_TOKEN);

  const pathname = request.nextUrl.pathname;

  const isNoAuthRoute = noAuthRoutes.some((pattern) => pattern.test(pathname));

  // 로그인/회원가입 페이지
  if (isNoAuthRoute) {
    // 로그인 상태라면 홈으로 이동
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/home', request.url));
    }

    // 비로그인은 접근 허용
    return NextResponse.next();
  }

  // 로그인/회원가입 외 모든 페이지는 인증 필요
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
};
