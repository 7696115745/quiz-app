import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const cookies = req.cookies;

  // Log the entire cookies object
  console.log("Cookies:", cookies);

  // Extract tokens from cookies
  // const AdminToken = cookies.get("email");
  // const UserToken = cookies.get("authjs.session-token");

  // console.log("Requested Pathname:", pathname);
  // console.log("Admin Token:", AdminToken);
  // console.log("Session Token:", UserToken);

  // // Skip middleware for static files, Next.js internal paths, and the login page
  // if (
  //   pathname.startsWith('/_next/') ||
  //   pathname.startsWith('/static/') ||
  //   pathname.startsWith('/public/') ||
  //   pathname.match(/\.(png|jpg|jpeg|gif|svg|ico)$/) ||
  //   pathname === '/login' || // Allow access to the login page
  //   pathname.startsWith('/api/auth') // Allow access to API routes
  // ) {
  //   return NextResponse.next();
  // }

  // // If `admintoken` is present, allow access to `/admin` and other routes
  // if (AdminToken) {
  //   if (pathname === '/admin'||pathname==='/adminsetQuestions'||pathname==="user"||pathname==="/") {
  //     return NextResponse.next();
  //   }
  //   if (pathname !== '/' && pathname !== '/login') {
  //     return NextResponse.next();
  //   }
  //   return NextResponse.redirect(new URL("/", req.url));
  // }

  // // If `AdminToken` is present, allow access to the home page and other routes
  // if (UserToken) {
  //   if (pathname === '/') {
  //     return NextResponse.next();
  //   }
  //   if (pathname !== '/login') {
  //     return NextResponse.next();
  //   }
  //   return NextResponse.redirect(new URL("/", req.url));
  // }

  // // Redirect to login page if no valid token is found and the user is not on the login page
  // if (!AdminToken && !UserToken && pathname !== '/login') {
  //   return NextResponse.redirect(new URL("/login", req.url));
  // }

  // Allow the request if none of the conditions are met
  return NextResponse.next();
}
