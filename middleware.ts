import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth?.user;

  // ログイン不要なパス
  const publicPaths = ["/", "/login", "/register", "/api"];

  // 保護されたパス
  const protectedPaths = ["/dashboard", "/booking", "/bookings", "/admin"];

  // 保護されたパスへのアクセス
  if (protectedPaths.some(path => pathname.startsWith(path))) {
    if (!isLoggedIn) {
      return Response.redirect(new URL("/login", req.url));
    }
  }

  // ログイン済みユーザーをログインページから除外
  if ((pathname === "/login" || pathname === "/register") && isLoggedIn) {
    return Response.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
