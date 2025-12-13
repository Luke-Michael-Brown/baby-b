import { atom } from 'jotai'
import config from '../../config'
import type { Dayjs } from 'dayjs'
import formatMsToMinSec from '../../utils/formatMsToMinSec'
import getDaysWithData from '../../utils/getDaysWithData'

// --- Summary Generators ---
export const TAB_TO_SUMMARY_DATA: Record<
  string,
  (data: any[], opts: { startDate: Dayjs; endDate: Dayjs }) => string[]
> = {
  //
  // ------------------------ BOTTLE ------------------------
  //
  bottle: data => {
    if (data.length === 0) return ['No data in range']

    let totalMl = 0
    let sessionCount = 0
    let vitDCount = 0

    data.forEach(entry => {
      const ml = parseFloat(entry.extra1)
      if (!isNaN(ml)) {
        totalMl += ml
        sessionCount++
        if (entry.extra2) vitDCount++
      }
    })

    const days = getDaysWithData(data)
    const avgPerDay = totalMl / days
    const avgPerSession = totalMl / sessionCount
    const avgSessionsPerDay = sessionCount / days
    const avgVitDPerDay = vitDCount / days

    return [
      `Averages ${avgPerDay.toFixed(2)} ml per day`,
      `Averages ${avgPerSession.toFixed(2)} ml per feed`,
      `Averages ${avgSessionsPerDay.toFixed(2)} feeds per day`,
      `Averages ${avgVitDPerDay.toFixed(2)} VitD per day`, // NEW
    ]
  },

  //
  // ------------------------ DIAPER ------------------------
  //
  diaper: data => {
    if (data.length === 0) return ['No data in range']

    let totalPee = 0
    let totalPoo = 0
    let totalEither = 0

    data.forEach(entry => {
      const val = entry.extra1.toLowerCase()
      if (val.includes('pee')) totalPee += 1
      if (val.includes('poo')) totalPoo += 1
      totalEither += 1
    })

    const days = getDaysWithData(data)
    const avgPee = totalPee / days
    const avgPoo = totalPoo / days
    const avgEither = totalEither / days

    return [
      `Averages ${avgPee.toFixed(2)} pees per day`,
      `Averages ${avgPoo.toFixed(2)} poops per day`,
      `Averages ${avgEither.toFixed(2)} diapers per day`,
    ]
  },

  //
  // ------------------------ NURSE ------------------------
  //
  nurse: data => {
    if (data.length === 0) return ['No data in range']

    let totalMs = 0
    let sessions = 0
    let vitDCount = 0

    data.forEach(entry => {
      const start = new Date(entry.start_time)
      const end = new Date(entry.end_time ?? entry.start_time)
      const duration = end.getTime() - start.getTime()

      totalMs += duration
      sessions++

      if (entry.extra2) vitDCount++
    })

    const days = getDaysWithData(data)
    const avgSessionsPerDay = sessions / days
    const avgVitDPerDay = vitDCount / days

    return [
      `Averages ${formatMsToMinSec(totalMs / days)} per day`,
      `Averages ${formatMsToMinSec(sessions > 0 ? totalMs / sessions : 0)} per nurse`,
      `Averages ${avgSessionsPerDay.toFixed(2)} nurses per day`,
      `Averages ${avgVitDPerDay.toFixed(2)} VitD per day`,
    ]
  },

  //
  // ------------------------ PUMP ------------------------
  //
  pump: data => {
    if (data.length === 0) return ['No data in range']

    let totalMl = 0
    let sessions = 0

    let totalPowerMl = 0
    let powerSessions = 0

    data.forEach(entry => {
      const ml = parseFloat(entry.extra2)
      if (!isNaN(ml)) {
        totalMl += ml
        sessions++

        if (entry.extra3) {
          totalPowerMl += ml
          powerSessions++
        }
      }
    })

    const days = getDaysWithData(data)
    const avgSessionsPerDay = sessions / days
    const avgPowerSessionsPerDay = powerSessions / days

    return [
      `Average: ${(totalMl / days).toFixed(2)} ml per day`,
      `Average: ${(sessions > 0 ? totalMl / sessions : 0).toFixed(2)} ml per pump`,
      `Average: ${avgSessionsPerDay.toFixed(2)} pumps per day`,
      `Average: ${(powerSessions > 0 ? totalPowerMl / powerSessions : 0).toFixed(2)} ml per power pump`,
      `Average: ${avgPowerSessionsPerDay.toFixed(2)} power pumps per day`,
    ]
  },

  //
  // ------------------------ SLEEP ------------------------
  //
  sleep: data => {
    if (data.length === 0) return ['No data in range']

    let totalSleepMs = 0
    let totalNapMs = 0
    let totalNightMs = 0

    data.forEach(entry => {
      const start = new Date(entry.start_time)
      const end = new Date(entry.end_time ?? start)
      const duration = end.getTime() - start.getTime()

      totalSleepMs += duration

      const type = entry.extra1.toLowerCase()
      if (type === 'nap') totalNapMs += duration
      else if (type === 'night sleep') totalNightMs += duration
    })

    const days = getDaysWithData(data)

    return [
      `Averages ${(totalSleepMs / (days * 1000 * 60)).toFixed(2)} mins of sleep per day`,
      `Averages ${(totalNapMs / (days * 1000 * 60)).toFixed(2)} mins of naps per day`,
      `Averages ${(totalNightMs / (days * 1000 * 60)).toFixed(2)} mins of night sleep per day`,
    ]
  },
}

// --- Tabs ---
export const TABS: string[] = Object.keys(config)

const selectedTabAtom = atom<string>(TABS[0])

export default atom(
  get => {
    const tab = get(selectedTabAtom)
    const tabConfig = config[tab]

    const getSummary = (data: any[], opts: { startDate: Dayjs; endDate: Dayjs }) => {
      const fn = TAB_TO_SUMMARY_DATA[tab]
      return fn ? fn(data, opts) : []
    }

    return {
      tab,
      tabConfig,
      getSummary,
    }
  },
  (_get, set, newTab: string) => {
    set(selectedTabAtom, newTab)
  }
)
