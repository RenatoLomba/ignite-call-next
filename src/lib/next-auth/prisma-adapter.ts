import type { NextApiRequest, NextApiResponse } from 'next'
import type { Adapter, AdapterSession, AdapterUser } from 'next-auth/adapters'
import { parseCookies, destroyCookie } from 'nookies'

import type { PrismaClient, Session, User } from '@prisma/client'

const userMap = (user: Omit<User, 'created_at'>): AdapterUser => {
  return {
    id: user.id,
    email: user.email!,
    avatar_url: user.avatar_url,
    emailVerified: null,
    name: user.name,
    username: user.username,
  }
}

const sessionMap = (session: Session): AdapterSession => {
  return {
    expires: session.expires,
    sessionToken: session.session_token,
    userId: session.user_id,
  }
}

type PrismaAdapterOptions = {
  req: NextApiRequest
  res: NextApiResponse
}

export function PrismaAdapter(
  client: PrismaClient,
  { req, res }: PrismaAdapterOptions,
): Adapter {
  return {
    async createUser({ email, avatar_url: avatarUrl }) {
      const { '@ignite-call:userId': userId } = parseCookies({ req })

      if (!userId) {
        throw new Error('ID do usuário não foi encontrado nos cookies.')
      }

      const user = await client.user.update({
        where: { id: userId },
        data: { email, avatar_url: avatarUrl },
      })

      destroyCookie({ res }, '@ignite-call:userId', { path: '/' })

      return userMap(user)
    },

    async getUser(id) {
      const user = await client.user.findUnique({ where: { id } })
      if (!user) return null
      return userMap(user)
    },

    async getUserByEmail(email) {
      const user = await client.user.findUnique({ where: { email } })
      if (!user) return null
      return userMap(user)
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const account = await client.account.findUnique({
        where: {
          provider_provider_account_id: {
            provider,
            provider_account_id: providerAccountId,
          },
        },
        include: {
          user: true,
        },
      })

      if (!account) return null
      return userMap(account.user)
    },

    async updateUser({ id, name, email, avatar_url: avatarUrl }) {
      const user = await client.user.update({
        where: { id },
        data: {
          name,
          email,
          avatar_url: avatarUrl,
        },
      })

      return userMap(user)
    },

    async linkAccount(account) {
      await client.account.create({
        data: {
          user_id: account.userId,
          provider: account.provider,
          provider_account_id: account.providerAccountId,
          type: account.type,
          access_token: account.access_token,
          expires_at: account.expires_at,
          id_token: account.id_token,
          refresh_token: account.refresh_token,
          scope: account.scope,
          session_state: account.session_state,
          token_type: account.token_type,
        },
      })
    },

    async createSession({ sessionToken, userId, expires }) {
      const session = await client.session.create({
        data: { expires, user_id: userId, session_token: sessionToken },
      })

      return sessionMap(session)
    },

    async getSessionAndUser(sessionToken) {
      const session = await client.session.findUnique({
        where: { session_token: sessionToken },
        include: {
          user: true,
        },
      })

      if (!session) return null
      return {
        session: sessionMap(session),
        user: userMap(session.user),
      }
    },

    async updateSession({ sessionToken, userId, expires }) {
      const session = await client.session.update({
        where: { session_token: sessionToken },
        data: { user_id: userId, expires },
      })

      return sessionMap(session)
    },

    async deleteSession(sessionToken) {
      await client.session.delete({ where: { session_token: sessionToken } })
    },
  }
}
