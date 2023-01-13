import dayjs from 'dayjs'
import { google } from 'googleapis'
import { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'

import { getGoogleOAuthToken } from '../../../../lib/google'
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

  const newSchedule = await prisma.schedule.create({
    select: { id: true },
    data: {
      date: schedulingDate.toDate(),
      email,
      name,
      observations,
      user_id: user.id,
    },
  })

  const auth = await getGoogleOAuthToken(user.id)
  const calendar = google.calendar({
    version: 'v3',
    auth,
  })

  await calendar.events.insert({
    calendarId: 'primary',
    conferenceDataVersion: 1,
    requestBody: {
      summary: `Ignite Call: ${name}`,
      description: observations,
      start: {
        dateTime: schedulingDate.format(),
      },
      end: {
        dateTime: schedulingDate.add(1, 'hour').format(),
      },
      attendees: [
        {
          email,
          displayName: name,
        },
      ],
      conferenceData: {
        createRequest: {
          requestId: newSchedule.id,
          conferenceSolutionKey: {
            type: 'hangoutsMeet',
          },
        },
      },
    },
  })

  return res.status(201).json({
    success: true,
  })
}
