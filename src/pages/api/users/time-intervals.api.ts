import { withAuthSession } from '../utils/with-auth-session'

const handler = withAuthSession((req, res, session) => {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  return res.status(201).json({
    session,
  })
})

export default handler
