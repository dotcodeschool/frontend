import { MongoDBAdapter } from "@auth/mongodb-adapter";
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";

import { authConfig } from "./auth.config";
import { clientPromise } from "./lib/db/mongodb";
import { prisma } from "./lib/db/prisma";

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
});
