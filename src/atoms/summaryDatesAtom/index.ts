import { atom } from 'jotai'
import dayjs, { Dayjs } from 'dayjs'

export const summayStartDateAtom = atom<Dayjs>(dayjs().startOf('day').subtract(8, 'day'))
export const summaryEndDateAtom = atom<Dayjs>(dayjs().endOf('day').subtract(1, 'day'))

export default {
  summayStartDateAtom,
  summaryEndDateAtom,
}
