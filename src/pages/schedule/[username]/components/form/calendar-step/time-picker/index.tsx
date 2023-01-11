import dayjs from 'dayjs'

import { Container, Header, TimeItem, TimeList } from './styles'

interface TimePickerProps {
  selectedDate: Date
}

export function TimePicker({ selectedDate }: TimePickerProps) {
  const selectedDateDayJs = dayjs(selectedDate)
  const weekDay = selectedDateDayJs.format('dddd')
  const monthDate = selectedDateDayJs.format('DD [de] MMMM')

  return (
    <Container>
      <Header>
        {weekDay} <span>{monthDate}</span>
      </Header>

      <TimeList>
        <TimeItem>08:00h</TimeItem>
        <TimeItem disabled>08:00h</TimeItem>
        <TimeItem>08:00h</TimeItem>
        <TimeItem>08:00h</TimeItem>
        <TimeItem disabled>08:00h</TimeItem>
        <TimeItem>08:00h</TimeItem>
        <TimeItem>08:00h</TimeItem>
        <TimeItem>08:00h</TimeItem>
        <TimeItem>08:00h</TimeItem>
        <TimeItem>08:00h</TimeItem>
        <TimeItem>08:00h</TimeItem>
        <TimeItem>08:00h</TimeItem>
        <TimeItem>08:00h</TimeItem>
        <TimeItem>08:00h</TimeItem>
        <TimeItem>08:00h</TimeItem>
        <TimeItem>08:00h</TimeItem>
        <TimeItem>08:00h</TimeItem>
      </TimeList>
    </Container>
  )
}
