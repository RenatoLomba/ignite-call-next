import type { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import type { Session } from 'next-auth'
import { getSession } from 'next-auth/react'
import { parseCookies } from 'nookies'

export function withSSRAuthSession(
  fn: (
    ctx: GetServerSidePropsContext,
    session: Session,
  ) => Promise<GetServerSidePropsResult<unknown>>,
) {
  return async (
    ctx: GetServerSidePropsContext,
  ): Promise<GetServerSidePropsResult<unknown>> => {
    const session = await getSession({ ctx })

    if (!session) {
      const { '@ignite-call:userId': userId } = parseCookies(ctx)

      if (!userId) {
        return {
          redirect: {
            destination: '/register',
            permanent: false,
          },
        }
      }

      return {
        redirect: {
          destination: '/register/calendar-connection',
          permanent: false,
        },
      }
    }

    return fn(ctx, session)
  }
}
