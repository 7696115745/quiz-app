import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const cookies = req.cookies;
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
  const AdminToken = cookies.get("email");
  const UserToken = cookies.get("authjs.session-token");

  // Check if any cookies are present
  if (!AdminToken && !UserToken) {
    // Redirect to login page if no cookies are found
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Allow the request if cookies are present
  return NextResponse.next();
}
