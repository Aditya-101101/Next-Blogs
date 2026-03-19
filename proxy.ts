import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	// ✅ Allow auth routes (no redirect loop)
	if (pathname.startsWith("/auth")) {
		return NextResponse.next();
	}

	// ✅ Check if session cookie exists
	const token = request.cookies.get("better-auth.session_token")?.value;

	// ❌ No token → redirect to login
	if (!token) {
		return NextResponse.redirect(new URL("/auth/login", request.url));
	}

	// ✅ Token exists → allow request
	return NextResponse.next();
}

export const config = {
	matcher: ["/blog", "/create"],
};