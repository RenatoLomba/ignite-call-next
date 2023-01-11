import { useState } from 'react'

import { Calendar } from '../../../../../../components'
import { Container } from './styles'
import { TimePicker } from './time-picker'

export function CalendarStep() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const isDateSelected = !!selectedDate

  return (
    <Container isTimePickerOpen={isDateSelected}>
      <Calendar
        selectedDate={selectedDate}
        onSelectDate={(date) => setSelectedDate(date)}
      />

      {isDateSelected ? <TimePicker selectedDate={selectedDate} /> : null}
    </Container>
  )
}
