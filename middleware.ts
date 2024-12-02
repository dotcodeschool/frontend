// export { auth as middleware } from "@/auth";

import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextRequest, NextResponse } from "next/server";
import { LOGIN, PROTECTED_SUBROUTES, PUBLIC_ROUTES, ROOT } from "./lib/route";

const { auth } = NextAuth(authConfig);

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;

  // Bypass middleware for NextAuth API routes
  if (nextUrl.pathname.startsWith("/api/auth/")) {
    console.log("Skipping middleware for NextAuth route:", nextUrl.pathname);
    return NextResponse.next();
  }

  const session = await auth();

  const isAuthenticated = !!session?.user;
  console.log("isAuthenticated", isAuthenticated, nextUrl.pathname);

  const isPublicRoutes =
    PUBLIC_ROUTES.find(
      (route) =>
        nextUrl.pathname.startsWith(route) || nextUrl.pathname === ROOT,
    ) && !PROTECTED_SUBROUTES.find((route) => nextUrl.pathname.includes(route));

  console.log("isPublicRoutes", isPublicRoutes);

  if (!isPublicRoutes && !isAuthenticated) {
    return NextResponse.redirect(new URL(LOGIN, nextUrl));
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
