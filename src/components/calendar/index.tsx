import dayjs, { type Dayjs } from 'dayjs'
import { CaretLeft, CaretRight } from 'phosphor-react'
import { useMemo, useState } from 'react'

import { getWeekDays } from '../../utils'
import { Actions, Body, Container, Day, Header, Title } from './styles'

const weekDays = getWeekDays({ short: true })

interface CalendarWeek {
  week: number
  days: Array<{
    date: Dayjs
    disabled: boolean
  }>
}

type CalendarWeeks = CalendarWeek[]

interface CalendarProps {
  selectedDate?: Date | null
  onSelectDate?: (date: Date) => void
  onChangeMonth?: (date: Date) => void
  blockedWeekDays?: number[]
  showEmptyCalendar?: boolean
}

export function Calendar({
  onSelectDate,
  blockedWeekDays,
  onChangeMonth,
  showEmptyCalendar = false,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(() => dayjs().set('date', 1))

  const currentMonth = currentDate.format('MMMM')
  const currentYear = currentDate.format('YYYY')

  const handlePreviousMonth = () => {
    const previousMonthDate = currentDate.subtract(1, 'month')
    setCurrentDate(previousMonthDate)
    onChangeMonth?.(previousMonthDate.toDate())
  }

  const handleNextMonth = () => {
    const nextMonthDate = currentDate.add(1, 'month')
    setCurrentDate(nextMonthDate)
    onChangeMonth?.(nextMonthDate.toDate())
  }

  const calendarWeeks = useMemo(() => {
    if (showEmptyCalendar) {
      return []
    }

    const daysInCurrentMonthList = Array.from({
      length: currentDate.daysInMonth(),
    }).map((_, i) => {
      return currentDate.set('date', i + 1)
    })

    const firstWeekDay = currentDate.get('day')

    const previousMonthFillArray = Array.from({
      length: firstWeekDay,
    })
      .map((_, i) => {
        return currentDate.subtract(i + 1, 'day')
      })
      .reverse()

    const lastDayInCurrentMonth = currentDate.daysInMonth()

    const lastWeekDay = currentDate
      .set('date', lastDayInCurrentMonth)
      .get('day')

    const nextMonthFillArray = Array.from({
      length: 7 - (lastWeekDay + 1),
    }).map((_, i) => {
      return currentDate.add(lastDayInCurrentMonth + i, 'day')
    })

    const calendarDays = [
      ...previousMonthFillArray.map((date) => ({
        date,
        disabled: true,
      })),
      ...daysInCurrentMonthList.map((date) => ({
        date,
        disabled:
          date.endOf('day').isBefore(new Date()) ||
          !!blockedWeekDays?.includes(date.get('day')),
      })),
      ...nextMonthFillArray.map((date) => ({
        date,
        disabled: true,
      })),
    ]

    const calendarDaysDividedIntoWeeks = calendarDays.reduce<CalendarWeeks>(
      (weeks, _, i, original) => {
        const isNewWeek = i % 7 === 0

        if (isNewWeek) {
          weeks.push({
            week: i / 7 + 1,
            days: original.slice(i, i + 7),
          })
        }

        return weeks
      },
      [],
    )

    return calendarDaysDividedIntoWeeks
  }, [currentDate, blockedWeekDays, showEmptyCalendar])

  return (
    <Container>
      <Header>
        <Title>
          {currentMonth} <span>{currentYear}</span>
        </Title>

        <Actions>
          <button onClick={handlePreviousMonth} title="Mês anterior">
            <CaretLeft />
          </button>

          <button onClick={handleNextMonth} title="Próximo mês">
            <CaretRight />
          </button>
        </Actions>
      </Header>

      <Body>
        <thead>
          <tr>
            {weekDays.map((day) => (
              <th key={day}>{day}.</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {calendarWeeks.map(({ week, days }) => (
            <tr key={week}>
              {days.map(({ date, disabled }) => (
                <td key={date.toString()}>
                  <Day
                    disabled={disabled}
                    onClick={() => onSelectDate?.(date.toDate())}
                  >
                    {date.get('date')}
                  </Day>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </Body>
    </Container>
  )
}
