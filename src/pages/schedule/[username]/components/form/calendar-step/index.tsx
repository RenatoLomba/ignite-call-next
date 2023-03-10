import dayjs from 'dayjs'
import { useRouter } from 'next/router'
import { useState } from 'react'

import { Text } from '@ignite-ui/react'
import { useQuery } from '@tanstack/react-query'

import { Calendar } from '../../../../../../components'
import { api } from '../../../../../../lib/axios'
import { Container } from './styles'
import { TimePicker } from './time-picker'

interface UserBlockedDatesResponseData {
  blockedWeekDays: number[]
  blockedDates: number[]
}

interface CalendarStepProps {
  onSelectDateTime: (date: Date) => void
}

export function CalendarStep({ onSelectDateTime }: CalendarStepProps) {
  const router = useRouter()
  const username = String(router.query.username)

  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const isDateSelected = !!selectedDate

  const year = currentDate.getUTCFullYear().toString()
  const month = (currentDate.getUTCMonth() + 1).toString().padStart(2, '0')

  const { data, isLoading, isError } = useQuery(
    ['user-blocked-dates', year, month, username],
    async () =>
      (
        await api.get<UserBlockedDatesResponseData>(
          `/users/${username}/blocked-dates`,
          {
            params: {
              year,
              month,
            },
          },
        )
      ).data,
  )

  if (isError) {
    return <Text>Erro ao buscar disponibilidades...</Text>
  }

  return (
    <Container isTimePickerOpen={isDateSelected} isLoading={isLoading}>
      {isLoading && <Text>Carregando disponibilidades...</Text>}

      <Calendar
        showEmptyCalendar={!data}
        onChangeMonth={(date) => setCurrentDate(date)}
        blockedWeekDays={data?.blockedWeekDays}
        blockedDates={data?.blockedDates}
        selectedDate={selectedDate}
        onSelectDate={(date) => setSelectedDate(date)}
      />

      {isDateSelected ? (
        <TimePicker
          onSelectTime={(time) =>
            onSelectDateTime(
              dayjs(selectedDate).set('hour', time).startOf('hour').toDate(),
            )
          }
          selectedDate={selectedDate}
        />
      ) : null}
    </Container>
  )
}
