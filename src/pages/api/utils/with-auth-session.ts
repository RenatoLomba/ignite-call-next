import type { NextApiRequest, NextApiResponse } from 'next'
import {
  unstable_getServerSession as getServerSession,
  type Session,
} from 'next-auth'
import { parseCookies } from 'nookies'

import { buildNextAuthOptions } from '../auth/[...nextauth].api'

export function withAuthSession(
  fn: (
    req: NextApiRequest,
    res: NextApiResponse,
    session: Session,
  ) => unknown | Promise<unknown>,
) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getServerSession(
      req,
      res,
      buildNextAuthOptions(req, res),
    )

    if (!session) {
      const { '@ignite-call:userId': userId } = parseCookies({ req })

      if (!userId) {
        return res.status(401).json({
          message: 'user.not.created',
        })
      }

      return res.status(401).json({
        message: 'user.not.authenticated',
      })
    }

    return fn(req, res, session)
  }
}
