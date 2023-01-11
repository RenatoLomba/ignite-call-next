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
        <TimeItem>09:00h</TimeItem>
        <TimeItem>10:00h</TimeItem>
        <TimeItem>11:00h</TimeItem>
        <TimeItem>12:00h</TimeItem>
        <TimeItem>13:00h</TimeItem>
        <TimeItem>14:00h</TimeItem>
        <TimeItem>15:00h</TimeItem>
        <TimeItem>16:00h</TimeItem>
        <TimeItem>17:00h</TimeItem>
        <TimeItem>18:00h</TimeItem>
        <TimeItem>19:00h</TimeItem>
        <TimeItem>20:00h</TimeItem>
        <TimeItem>21:00h</TimeItem>
        <TimeItem>22:00h</TimeItem>
        <TimeItem>23:00h</TimeItem>
        <TimeItem>24:00h</TimeItem>
      </TimeList>
    </Container>
  )
}
