import type { NextApiRequest, NextApiResponse } from 'next'

import { prisma } from '../../../lib/prisma'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const { name, username } = req.body

  try {
    const user = await prisma.user.create({
      select: {
        id: true,
      },
      data: {
        name,
        username,
      },
    })

    return res.status(201).json({
      id: user.id,
      name,
      username,
    })
  } catch (error) {
    console.error('CREATE USER ERROR', error)
    return res.status(500).send("Could't create user")
  }
}
