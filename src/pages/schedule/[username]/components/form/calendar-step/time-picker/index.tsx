import dayjs from 'dayjs'
import { useRouter } from 'next/router'

import { Text } from '@ignite-ui/react'
import { useQuery } from '@tanstack/react-query'

import { api } from '../../../../../../../lib/axios'
import { Container, Header, TimeItem, TimeList } from './styles'

interface UserAvailabilityResponseData {
  availability: number[]
  possibleTimes: number[]
}

interface TimePickerProps {
  selectedDate: Date
  onSelectTime: (time: number) => void
}

export function TimePicker({ selectedDate, onSelectTime }: TimePickerProps) {
  const router = useRouter()
  const username = String(router.query.username)

  const selectedDateDayJs = dayjs(selectedDate)
  const weekDay = selectedDateDayJs.format('dddd')
  const monthDate = selectedDateDayJs.format('DD [de] MMMM')

  const { data, isLoading, isError } = useQuery(
    ['user-available-hours', selectedDate, username],
    async () =>
      (
        await api.get<UserAvailabilityResponseData>(
          `/users/${username}/availability?date=${selectedDateDayJs.format(
            'YYYY-MM-DD[T]HH:mm:ss',
          )}`,
        )
      ).data,
    {
      select(data) {
        if (!data) return data

        return data.possibleTimes.map((time) => {
          const disabled = !data.availability.includes(time)

          return {
            disabled,
            time,
            timeFormatted: selectedDateDayJs
              .set('hour', time)
              .set('minutes', 0)
              .format('HH:mm'),
          }
        })
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
          data.map((availableTime) => (
            <TimeItem
              onClick={() => onSelectTime(availableTime.time)}
              disabled={availableTime.disabled}
              key={`${selectedDate.getTime()}__${availableTime.time}`}
            >
              {availableTime.timeFormatted}
            </TimeItem>
          ))
        )}
      </TimeList>
    </Container>
  )
}
