import type { NextAuthConfig } from "next-auth";
import GitHub from "next-auth/providers/github";

// Base config without database adapter for edge compatibility
export const authConfig = {
  providers: [GitHub],
} satisfies NextAuthConfig;
