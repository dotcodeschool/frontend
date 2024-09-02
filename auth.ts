import NextAuth from "next-auth";
import { NextAuthConfig } from "next-auth";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import GitHub from "next-auth/providers/github";
import clientPromise from "@/app/lib/mongodb";

const adapter = MongoDBAdapter(clientPromise);

export const authConfig: NextAuthConfig = {
  providers: [GitHub],
  adapter,
};

export const { auth, handlers, signIn, signOut } = NextAuth(authConfig);
