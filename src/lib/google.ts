import dayjs from 'dayjs'
import { google } from 'googleapis'

import { prisma } from './prisma'

export async function getGoogleOAuthToken(userId: string) {
  const account = await prisma.account.findFirstOrThrow({
    where: {
      provider: 'google',
      user_id: userId,
    },
  })

  const auth = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  })

  const expiresAtInMilliseconds = account.expires_at
    ? account.expires_at * 1000
    : null

  auth.setCredentials({
    access_token: account.access_token,
    refresh_token: account.refresh_token,
    expiry_date: expiresAtInMilliseconds,
  })

  if (!account.expires_at) {
    return auth
  }

  const isTokenExpired = dayjs(expiresAtInMilliseconds).isAfter(new Date())

  if (isTokenExpired) {
    const { credentials } = await auth.refreshAccessToken()
    const {
      access_token: accessToken,
      refresh_token: refreshToken,
      expiry_date: expiresAt,
      id_token: idToken,
      token_type: tokenType,
      scope,
    } = credentials

    await prisma.account.update({
      where: { id: account.id },
      data: {
        access_token: accessToken,
        expires_at: expiresAt ? Math.floor(expiresAt / 1000) : null,
        id_token: idToken,
        refresh_token: refreshToken,
        token_type: tokenType,
        scope,
      },
    })

    auth.setCredentials({
      access_token: accessToken,
      expiry_date: expiresAt,
      refresh_token: refreshToken,
    })
  }

  return auth
}
