import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import { prisma } from '../../../../lib/prisma'

const paramsSchema = z.object({
  username: z.string(),
  year: z.string(),
  month: z.string(),
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

  const { username, month, year } = validationResult.data

  const user = await prisma.user.findUnique({
    where: { username },
  })

  if (!user) {
    return res.status(400).json({
      message: 'Nome de usuário inválido.',
    })
  }

  const availableWeekDays = await prisma.userTimeInterval.findMany({
    select: { week_day: true },
    where: { user_id: user.id },
  })

  const blockedWeekDays = [0, 1, 2, 3, 4, 5, 6].filter(
    (day) => !availableWeekDays.some((awd) => awd.week_day === day),
  )

  const blockedDatesRaw = await prisma.$queryRaw`
    SELECT *
    FROM schedules S

    WHERE S.user_id = ${user.id}
    AND DATE_FORMAT(S.date, "%Y-%m") = ${`${year}-${month}`}
  `

  console.log({ blockedDatesRaw })

  return res.json({ blockedWeekDays })
}
