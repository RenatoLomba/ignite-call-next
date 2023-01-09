export const convertTimeStringToMinutes = (value: string) => {
  const [hours, minutes] = value.split(':')
  return Number(hours) * 60 + Number(minutes)
}
