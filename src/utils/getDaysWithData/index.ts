import dayjs from 'dayjs'

export default function getDaysWithData(filteredData: any[]): number {
  const uniqueDays = new Set<string>()

  filteredData.forEach(entry => {
    const localDay = dayjs(entry.start_time).format('YYYY-MM-DD')
    uniqueDays.add(localDay)
  })

  return uniqueDays.size
}
