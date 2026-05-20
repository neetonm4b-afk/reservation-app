import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// ─── Light middleware without Prisma/DB ──────────────────────────────────────
// NextAuth v5 auth() in middleware requires Edge runtime compatibility.
// We use a simple cookie-based check here and rely on server components for full session.

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for NextAuth session token (either secure or regular cookie)
  const sessionToken =
    request.cookies.get("next-auth.session-token")?.value ||
    request.cookies.get("__Secure-next-auth.session-token")?.value ||
    request.cookies.get("authjs.session-token")?.value;

  const isLoggedIn = !!sessionToken;

  // Admin routes protection (basic cookie check - full auth in page/layout)
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // User routes protection
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/booking") || pathname.startsWith("/bookings")) {
    if (!isLoggedIn) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // Redirect logged-in users away from auth pages
  if ((pathname === "/login" || pathname === "/register") && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
