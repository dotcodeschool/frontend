"use server";

import { signIn, signOut } from "@/auth";

export const handleSignIn = async (options?: { redirectTo?: string }) => {
  await signIn("", options);
};

export const handleSignOut = async () => {
  await signOut();
};
