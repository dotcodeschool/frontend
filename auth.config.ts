import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";

// Base config without database adapter for edge compatibility
export const authConfig = {
  providers: [],
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
    async session({ session, token }: { session: any; token: any }) {
      session.user.id = token.sub;
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
} satisfies NextAuthConfig;
