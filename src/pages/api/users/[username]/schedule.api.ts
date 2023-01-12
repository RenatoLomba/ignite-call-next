import dayjs from 'dayjs'
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import { prisma } from '../../../../lib/prisma'

const paramsSchema = z.object({
  username: z.string(),
})

const bodySchema = z.object({
  date: z.string().datetime(),
  name: z.string(),
  email: z.string(),
  observations: z.string().optional().nullable(),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  const paramsValidationResult = paramsSchema.safeParse(req.query)

  if (!paramsValidationResult.success) {
    return res.status(400).json({
      errors: paramsValidationResult.error,
    })
  }

  const bodyValidationResult = bodySchema.safeParse(req.body)

  if (!bodyValidationResult.success) {
    return res.status(400).json({
      errors: bodyValidationResult.error,
    })
  }

  const { username } = paramsValidationResult.data

  const user = await prisma.user.findUnique({
    where: { username },
  })

  if (!user) {
    return res.status(400).json({
      message: 'Nome de usuário inválido.',
    })
  }

  const { date, email, name, observations } = bodyValidationResult.data

  const schedulingDate = dayjs(date).startOf('hour')

  if (schedulingDate.isBefore(new Date())) {
    return res.status(400).json({
      message: 'Data inválida pois já passou.',
    })
  }

  const conflictingScheduling = await prisma.schedule.findFirst({
    where: {
      user_id: user.id,
      date: schedulingDate.toDate(),
    },
  })

  if (conflictingScheduling) {
    return res.status(400).json({
      message: 'Usuário já possui um agendamento nessa data e horário.',
    })
  }

  await prisma.schedule.create({
    data: {
      date: schedulingDate.toDate(),
      email,
      name,
      observations,
      user_id: user.id,
    },
  })

  return res.status(201).json({
    success: true,
  })
}
