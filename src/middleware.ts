import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow requests for static assets to pass through
  if (pathname.startsWith('/_next/') || pathname.startsWith('/static/')) {
    return NextResponse.next();
  }

  // Allow all requests to /api/auth/* to pass through
  if (pathname.startsWith('/api/auth/')) {
    return NextResponse.next();
  }

  // Skip middleware for the login page
  if (pathname === '/login') {
    return NextResponse.next();
  }

  const adminToken = req.cookies.get("email");
  const userToken = req.cookies.get("authjs.session-token");

  // Redirect to login if neither token is found
  if (!adminToken && !userToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Allow access to all routes if any token is present
  return NextResponse.next();
}