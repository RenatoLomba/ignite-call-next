import type { NextApiRequest, NextApiResponse } from 'next'
import { setCookie } from 'nookies'

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
    const userAlreadyExists = await prisma.user.findUnique({
      where: { username },
      select: { id: true },
    })

    if (userAlreadyExists) {
      return res.status(400).json({
        message: 'Nome de usuário já existente',
      })
    }

    const user = await prisma.user.create({
      select: {
        id: true,
      },
      data: {
        name,
        username,
      },
    })

    setCookie({ res }, '@ignite-call:userId', user.id, {
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
      path: '/', // all routes
    })

    return res.status(201).json({
      id: user.id,
      name,
      username,
    })
  } catch (error) {
    console.error('CREATE USER ERROR', error)
    return res.status(500).json({ message: "Could't create user" })
  }
}
