import dayjs from 'dayjs'
import type { NextApiRequest, NextApiResponse } from 'next'
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
        gte: referenceDate // greater than or equal
          .set('hour', startTimeHour)
          .set('minutes', 0)
          .set('seconds', 0)
          .toDate(),
        lte: referenceDate // less than or equal
          .set('hour', endTimeHour)
          .set('minutes', 0)
          .set('seconds', 0)
          .toDate(),
      },
    },
  })

  const availability = possibleTimes.filter((time) => {
    const isTimeBlocked = blockedTimes.some((bt) => bt.date.getHours() === time)
    const isPastTime = referenceDate.set('hour', time).isBefore(new Date())

    return !isTimeBlocked && !isPastTime
  })

  return res.json({ availability, possibleTimes })
}
