import { useState } from 'react'

import { CalendarStep } from './calendar-step'
import { ConfirmationStep } from './confirmation-step'

export function ScheduleForm() {
  const [selectedDateTime, setSelectedDateTime] = useState<Date | null>(null)

  if (selectedDateTime) {
    return (
      <ConfirmationStep
        onCancel={() => setSelectedDateTime(null)}
        schedulingDate={selectedDateTime}
      />
    )
  }

  return <CalendarStep onSelectDateTime={setSelectedDateTime} />
}
