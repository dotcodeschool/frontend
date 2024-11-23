import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import NextAuth from "next-auth";

import { authConfig } from "./auth.config";
import { clientPromise } from "./lib/db/mongodb";

const prisma = new PrismaClient();

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: "jwt" },
  adapter: PrismaAdapter(prisma),
});
