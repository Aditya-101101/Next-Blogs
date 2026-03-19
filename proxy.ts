import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const cookie = request.cookies.get("better-auth.session_token");

  // allow login/signup pages always
  if (request.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.next();
  }

  // if no cookie → redirect
  if (!cookie) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/blog", "/create"],
};