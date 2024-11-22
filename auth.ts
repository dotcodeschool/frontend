import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth from "next-auth";

import { authConfig } from "./auth.config";
import { clientPromise } from "./lib/db/mongodb";

export const { auth, handlers, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: process.env.DB_NAME,
  }),
});
