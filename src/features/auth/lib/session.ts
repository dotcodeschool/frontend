import { getSession as getAuthSession } from 'auth-astro/server'

export type SessionUser = {
  id: string
  login: string
  name: string
  avatarUrl: string
}

export type Session = {
  user: SessionUser
  accessToken: string
}

export async function getSession(request: Request): Promise<Session | null> {
  const session = await getAuthSession(request)
  if (!session?.user) return null

  return {
    user: {
      id: session.user.id ?? '',
      login: (session.user as any).login ?? session.user.name ?? '',
      name: session.user.name ?? '',
      avatarUrl: session.user.image ?? '',
    },
    accessToken: (session as any).accessToken ?? '',
  }
}

export async function getAccessToken(request: Request): Promise<string | null> {
  const session = await getSession(request)
  return session?.accessToken ?? null
}
