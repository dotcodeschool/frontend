"use server";

import { signIn, signOut } from "@/auth";
import { RedirectType } from "next/navigation";

export const handleSignIn = async (options?: { redirectTo?: string }) => {
  // Default to redirecting to the home page if no redirectTo is provided
  const redirectOptions = options?.redirectTo
    ? { callbackUrl: options.redirectTo }
    : { callbackUrl: "/" };

  // Explicitly use GitHub provider for consistency with the login page
  // Don't try/catch here as NextAuth will throw a NEXT_REDIRECT error
  // which is expected and should be propagated
  return signIn("github", redirectOptions);
};

export const handleSignOut = async (options?: { redirectTo?: string }) => {
  // For signOut, we need to use the redirectTo property directly
  const redirectOptions = options?.redirectTo
    ? { redirectTo: options.redirectTo }
    : { redirectTo: "/" };

  // Don't try/catch here as NextAuth will throw a NEXT_REDIRECT error
  // which is expected and should be propagated
  return signOut(redirectOptions);
};
