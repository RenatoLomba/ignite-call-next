import { z } from 'zod'

import { prisma } from '../../../lib/prisma'
import { withAuthSession } from '../utils/with-auth-session'

const bodySchema = z.object({
  intervals: z
    .array(
      z.object({
        weekDay: z.number().min(0).max(6),
        startTime: z.number(),
        endTime: z.number(),
      }),
    )
    .min(1)
    .refine(
      (intervals) => {
        return intervals.every(
          (interval) => interval.endTime - 60 >= interval.startTime,
        )
      },
      {
        message:
          'O horário de término deve ser pelo menos 1 hora depois do horário de inicio.',
      },
    ),
})

const handler = withAuthSession(async (req, res, session) => {
  if (req.method !== 'POST') {
    return res.status(405).end()
  }

  try {
    const { intervals } = bodySchema.parse(req.body)

    await Promise.all(
      intervals.map(async ({ endTime, startTime, weekDay }) => {
        return await prisma.userTimeInterval.create({
          data: {
            week_day: weekDay,
            end_time: endTime,
            start_time: startTime,
            user_id: session.user?.id,
          },
        })
      }),
    )

    return res.status(201).json({
      success: true,
    })
  } catch (err) {
    console.error('CREATE INTERVALS ERROR', err)
    return res.status(500).send({ message: "Could't create intervals" })
  }
})

export default handler
