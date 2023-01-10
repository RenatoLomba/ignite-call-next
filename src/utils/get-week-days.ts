interface GetWeekDaysProps {
  short?: boolean
}

export function getWeekDays({ short }: GetWeekDaysProps) {
  const formatter = new Intl.DateTimeFormat('pt-BR', { weekday: 'long' })

  return Array.from(Array(7).keys())
    .map((day) => formatter.format(new Date(Date.UTC(2021, 5, day))))
    .map((day) => {
      if (short) {
        return day.substring(0, 3).toUpperCase()
      }

      return day.substring(0, 1).toUpperCase().concat(day.substring(1))
    })
}
