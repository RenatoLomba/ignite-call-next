import NextAuth, { type NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'

const googleApisUrl = 'https://www.googleapis.com'

const getGoogleApiUrlScope = (scopes: string[]) => {
  return scopes.map((scope) => `${googleApisUrl}/auth/${scope}`).join(' ')
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: getGoogleApiUrlScope([
            'userinfo.email',
            'userinfo.profile',
            'calendar',
          ]),
        },
      },
    }),
  ],

  callbacks: {
    async signIn({ account }) {
      if (!account?.scope?.includes(getGoogleApiUrlScope(['calendar']))) {
        return '/register/calendar-connection?permissions_error=calendar'
      }

      return true
    },
  },
}

export default NextAuth(authOptions)
