import { z } from 'zod'

import { prisma } from '../../../lib/prisma'
import { withAuthSession } from '../utils/with-auth-session'

const bodySchema = z.object({
  bio: z.string(),
})

const handler = withAuthSession(async (req, res, session) => {
  if (req.method !== 'PATCH') {
    return res.status(405).end()
  }

  try {
    const { bio } = bodySchema.parse(req.body)

    await prisma.user.update({
      where: { id: session.user.id },
      data: { bio },
    })

    return res.status(200).json({
      success: true,
    })
  } catch (err) {
    console.error('UPDATE USER PROFILE ERROR', err)
    return res.status(500).json({ message: "Could't update user profile" })
  }
})

export default handler
