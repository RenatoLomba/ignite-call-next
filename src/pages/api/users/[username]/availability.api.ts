import dayjs from 'dayjs'
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import { prisma } from '../../../../lib/prisma'

const paramsSchema = z.object({
  username: z.string(),
  date: z
    .string()
    .transform((value) => new Date(value))
    .refine((date) => date.toString() !== 'Invalid Date'),
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') {
    return res.status(405).end()
  }

  const validationResult = paramsSchema.safeParse(req.query)

  if (!validationResult.success) {
    return res.status(400).json({
      errors: validationResult.error,
    })
  }

  const { date, username } = validationResult.data

  const user = await prisma.user.findUnique({
    where: { username },
  })

  if (!user) {
    return res.status(400).json({
      message: 'Nome de usuário inválido.',
    })
  }

  const referenceDate = dayjs(date)

  const isPastDate = referenceDate.endOf('day').isBefore(new Date())

  if (isPastDate) {
    return res.json({ availability: [] })
  }

  const userAvailability = await prisma.userTimeInterval.findFirst({
    select: {
      start_time: true,
      end_time: true,
    },
    where: {
      user_id: user.id,
      week_day: referenceDate.get('day'),
    },
  })

  if (!userAvailability) {
    return res.json({ availability: [] })
  }

  const { end_time: endTime, start_time: startTime } = userAvailability

  const endTimeHour = Math.round(endTime / 60)
  const startTimeHour = Math.round(startTime / 60)

  const possibleTimes = Array.from({
    length: endTimeHour - startTimeHour,
  }).map((_, i) => startTimeHour + i)

  const blockedTimes = await prisma.schedule.findMany({
    select: {
      date: true,
    },
    where: {
      user_id: user.id,
      date: {
        gte: referenceDate.set('hour', startTimeHour).toDate(), // greater than or equal
        lte: referenceDate.set('hour', endTimeHour).toDate(), // less than or equal
      },
    },
  })

  const availability = possibleTimes.filter((time) => {
    return !blockedTimes.some((bt) => bt.date.getHours() === time)
  })

  return res.json({ availability })
}
