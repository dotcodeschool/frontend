import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";

// Base config without database adapter for edge compatibility
export const authConfig = {
  providers: [GitHub],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isCourse = nextUrl.pathname.startsWith("/courses");

      if (isCourse) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }
      return true;
    },
  },
} satisfies NextAuthConfig;
