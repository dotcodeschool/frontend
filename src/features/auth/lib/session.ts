import { getSession as getAuthSession } from "auth-astro/server";

// Augment Auth.js types to include our custom fields
declare module "@auth/core/types" {
  interface Session {
    accessToken?: string;
  }
  interface User {
    login?: string;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    accessToken?: string;
  }
}

export type SessionUser = {
  id: string;
  login: string;
  name: string;
  avatarUrl: string;
};

export type Session = {
  user: SessionUser;
  accessToken: string;
};

export async function getSession(request: Request): Promise<Session | null> {
  const session = await getAuthSession(request);
  if (!session?.user) return null;

  return {
    user: {
      id: session.user.id ?? "",
      login: session.user.login ?? session.user.name ?? "",
      name: session.user.name ?? "",
      avatarUrl: session.user.image ?? "",
    },
    accessToken: session.accessToken ?? "",
  };
}

export async function getAccessToken(request: Request): Promise<string | null> {
  const session = await getSession(request);
  return session?.accessToken ?? null;
}
