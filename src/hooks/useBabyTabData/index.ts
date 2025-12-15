import { useQuery } from '@tanstack/react-query'
import { useAtomValue } from 'jotai'
import useGoogleAPI from '../useGoogleAPI'
import selectedTabAtom from '../../atoms/selectedTabAtom'
import selectedBabyAtom from '../../atoms/selectedBabyAtom'

const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: true,
}

export interface Entry {
  id: string
  start_time: string
  end_time?: string
  isShown?: boolean
  [key: string]: string | boolean | number | undefined
}

export interface BabyData {
  [tab: string]: Entry[]
}

interface Data {
  [babyName: string]: BabyData
}

interface Props {
  overrideTab?: string
}

export default function useBabyTabData({ overrideTab }: Props = {}) {
  const { fetchJsonFromDrive } = useGoogleAPI()
  const { tab } = useAtomValue(selectedTabAtom)
  const selectedBaby = useAtomValue(selectedBabyAtom)

  return useQuery({
    queryKey: ['babies-data'],
    queryFn: () => fetchJsonFromDrive() as Promise<Data>,
    select: (data: Data) => {
      if (!selectedBaby || !data[selectedBaby]) return []

      const entries = data[selectedBaby]?.[overrideTab ?? tab] ?? []

      return entries
        .filter((entry: Entry) => entry.isShown)
        .sort(
          (a: Entry, b: Entry) =>
            new Date(b.start_time).getTime() - new Date(a.start_time).getTime()
        )
        .map((entry: Entry) => ({
          ...entry,
          start_time: new Date(entry.start_time).toLocaleString('en-US', DATE_OPTIONS),
          end_time: entry.end_time
            ? new Date(entry.end_time).toLocaleString('en-US', DATE_OPTIONS)
            : undefined,
        }))
    },
  })
}
