import type { NextApiRequest, NextApiResponse } from 'next'
import NextAuth, { type NextAuthOptions } from 'next-auth'
import GoogleProvider, { type GoogleProfile } from 'next-auth/providers/google'

import { PrismaAdapter } from '../../../lib/next-auth/prisma-adapter'
import { prisma } from '../../../lib/prisma'

const googleApisUrl = 'https://www.googleapis.com'

const getGoogleApiUrlScope = (scopes: string[]) => {
  return scopes.map((scope) => `${googleApisUrl}/auth/${scope}`).join(' ')
}

export function buildNextAuthOptions(
  req: NextApiRequest,
  res: NextApiResponse,
): NextAuthOptions {
  return {
    adapter: PrismaAdapter(prisma, { req, res }),
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        authorization: {
          params: {
            prompt: 'consent',
            access_type: 'offline',
            response_type: 'code',
            scope: getGoogleApiUrlScope([
              'userinfo.email',
              'userinfo.profile',
              'calendar',
            ]),
          },
        },
        profile(profile: GoogleProfile) {
          return {
            id: profile.sub,
            name: profile.name,
            email: profile.email,
            username: '',
            avatar_url: profile.picture,
          }
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
      async session({ session, user }) {
        return {
          ...session,
          user,
        }
      },
    },
  }
}

export default async function auth(req: NextApiRequest, res: NextApiResponse) {
  return await NextAuth(req, res, buildNextAuthOptions(req, res))
}
