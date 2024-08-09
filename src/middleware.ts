import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Skip middleware for static files, Next.js internal paths, and the login page
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.startsWith('/public/') ||
    pathname.match(/\.(png|jpg|jpeg|gif|svg|ico)$/) ||
    pathname === '/login' || // Allow access to the login page
    pathname.startsWith('/api/auth/') // Allow access to API routes
  ) {
    return NextResponse.next();
  }

  // Extract tokens from cookies
  const adminToken = req.cookies.get("email");
  const userToken = req.cookies.get("authjs.session-token");

  // Redirect to login if neither token is found
  if (!adminToken && !userToken) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Allow access to all routes if any token is present
  return NextResponse.next();
}
