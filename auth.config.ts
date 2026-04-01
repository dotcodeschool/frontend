import GitHub from '@auth/core/providers/github'
import { defineConfig } from 'auth-astro'

export default defineConfig({
  providers: [
    GitHub({
      clientId: import.meta.env.AUTH_GITHUB_ID,
      clientSecret: import.meta.env.AUTH_GITHUB_SECRET,
      authorization: {
        params: {
          scope: 'repo gist read:user',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }) {
      return {
        ...session,
        accessToken: token.accessToken as string,
      }
    },
  },
})
