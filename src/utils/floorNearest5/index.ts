import dayjs from 'dayjs'

export default function floorTo5(date: dayjs.Dayjs) {
  const minutes = date.minute()
  const floored = Math.floor(minutes / 5) * 5

  return date.minute(floored).second(0).millisecond(0)
}
