import type { Adapter, AdapterSession, AdapterUser } from 'next-auth/adapters'

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

export function PrismaAdapter(client: PrismaClient): Adapter {
  return {
    async createUser(user) {},

    async getUser(id) {
      const user = await client.user.findUniqueOrThrow({ where: { id } })
      return userMap(user)
    },

    async getUserByEmail(email) {
      const user = await client.user.findUniqueOrThrow({ where: { email } })
      return userMap(user)
    },

    async getUserByAccount({ providerAccountId, provider }) {
      const { user } = await client.account.findUniqueOrThrow({
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
      return userMap(user)
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
      const session = await client.session.findUniqueOrThrow({
        where: { session_token: sessionToken },
        include: {
          user: true,
        },
      })

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

    async createVerificationToken({ identifier, expires, token }) {
      const verToken = await client.verificationToken.create({
        data: { expires, identifier, token },
      })

      return verToken
    },

    async useVerificationToken({ identifier, token }) {
      const verToken = await client.verificationToken.findUniqueOrThrow({
        where: {
          identifier_token: {
            identifier,
            token,
          },
        },
      })

      return verToken
    },
  }
}
