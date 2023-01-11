import dayjs from 'dayjs'
import { useRouter } from 'next/router'

import { Text } from '@ignite-ui/react'
import { useQuery } from '@tanstack/react-query'

import { api } from '../../../../../../../lib/axios'
import { Container, Header, TimeItem, TimeList } from './styles'

interface UserAvailabilityResponseData {
  availability: number[]
}

interface TimePickerProps {
  selectedDate: Date
}

export function TimePicker({ selectedDate }: TimePickerProps) {
  const router = useRouter()
  const username = String(router.query.username)

  const selectedDateDayJs = dayjs(selectedDate)
  const weekDay = selectedDateDayJs.format('dddd')
  const monthDate = selectedDateDayJs.format('DD [de] MMMM')

  const { data, isLoading, isError } = useQuery(
    ['user-available-hours', selectedDate],
    async () => {
      return (
        await api.get<UserAvailabilityResponseData>(
          `/users/${username}/availability?date=${selectedDateDayJs.format(
            'YYYY-MM-DD[T]HH:mm:ss',
          )}`,
        )
      ).data
    },
    {
      select(data) {
        if (!data) return data

        return {
          availability: data.availability.map((time) => ({
            time,
            timeFormatted: selectedDateDayJs
              .set('hour', time)
              .set('minutes', 0)
              .format('HH:mm'),
          })),
        }
      },
    },
  )

  return (
    <Container>
      <Header>
        {weekDay} <span>{monthDate}</span>
      </Header>

      <TimeList>
        {isLoading ? (
          <Text>Carregando...</Text>
        ) : isError || !data ? (
          <Text>Erro ao buscar horários disponíveis...</Text>
        ) : (
          data.availability.map((at) => (
            <TimeItem key={`${selectedDate.getTime()}__${at.time}`}>
              {at.timeFormatted}
            </TimeItem>
          ))
        )}
      </TimeList>
    </Container>
  )
}
