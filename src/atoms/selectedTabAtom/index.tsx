import { atom } from 'jotai'
import dayjs, { Dayjs } from 'dayjs'
import Box from '@mui/material/Box'
import CribIcon from '@mui/icons-material/Crib'
import BabyChangingStationIcon from '@mui/icons-material/BabyChangingStation'
import PregnantWomanIcon from '@mui/icons-material/PregnantWoman'
import WaterDropIcon from '@mui/icons-material/WaterDrop'
import JoinInnerIcon from '@mui/icons-material/JoinInner'
import type { GridColType, GridRowParams } from '@mui/x-data-grid'
import appIconUrl from '../../assets/baby_b_svg.svg'

// --- Types ---
export type TabKey = 'summary' | 'sleep' | 'diaper' | 'nurse' | 'bottle' | 'pump'

export type RangeOption = 'Last Week' | 'Last Month' | 'Last Year'

type COLUMN_ENTRY =
  | {
      flex?: number
      field: string
      headerName: string
      formType?: string
      type?: GridColType
      getActions?: (params: GridRowParams) => React.ReactNode[]
      renderCell?: (param: any) => any
    }
  | {
      flex?: number
      field: string
      headerName: string
      formType: 'select'
      selectFields: string[]
      type?: GridColType
      getActions?: (params: GridRowParams) => React.ReactNode[]
      renderCell?: (param: any) => any
    }

const renderTwoLineDate = (params: any) => {
  const value = params.value
  if (!value) return ''

  const d = new Date(value)

  const dateStr = d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })

  const timeStr = d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
      <span>{dateStr}</span>
      <span>{timeStr}</span>
    </div>
  )
}

export const COLUMNS: { [key: string]: COLUMN_ENTRY[] } = {
  sleep: [
    {
      flex: 100,
      field: 'start_time',
      headerName: 'Start',
      formType: 'datePicker',
      renderCell: renderTwoLineDate,
    },
    {
      flex: 100,
      field: 'end_time',
      headerName: 'End',
      formType: 'datePicker',
      renderCell: renderTwoLineDate,
    },
    {
      flex: 100,
      field: 'extra1',
      headerName: 'Type',
      formType: 'select',
      selectFields: ['Night Sleep', 'Nap'],
    },
  ],
  diaper: [
    {
      flex: 100,
      field: 'start_time',
      headerName: 'Start',
      formType: 'datePicker',
      renderCell: renderTwoLineDate,
    },
    {
      flex: 100,
      field: 'extra1',
      headerName: 'Type',
      formType: 'select',
      selectFields: ['Pee', 'Poo', 'Pee & Poo'],
    },
  ],
  nurse: [
    {
      flex: 100,
      field: 'start_time',
      headerName: 'Start',
      formType: 'datePicker',
      renderCell: renderTwoLineDate,
    },
    {
      flex: 100,
      field: 'end_time',
      headerName: 'End',
      formType: 'datePicker',
      renderCell: renderTwoLineDate,
    },
    {
      flex: 100,
      field: 'extra1',
      headerName: 'Side',
      formType: 'select',
      selectFields: ['Left', 'Right', 'Both'],
    },
    {
      flex: 90,
      field: 'extra2',
      headerName: 'VitD',
      formType: 'checkbox',
      renderCell: params => (params.value ? '✓' : ''),
    },
  ],
  bottle: [
    {
      flex: 100,
      field: 'start_time',
      headerName: 'Start',
      formType: 'datePicker',
      renderCell: renderTwoLineDate,
    },
    {
      flex: 60,
      field: 'extra1',
      headerName: 'mL',
      formType: 'number',
    },
    {
      flex: 60,
      field: 'extra2',
      headerName: 'VitD',
      formType: 'checkbox',
      renderCell: params => (params.value ? '✓' : ''),
    },
  ],
  pump: [
    {
      flex: 100,
      field: 'start_time',
      headerName: 'Start',
      formType: 'datePicker',
      renderCell: renderTwoLineDate,
    },
    {
      flex: 60,
      field: 'extra2',
      headerName: 'mL',
      formType: 'number',
    },
    {
      flex: 60,
      field: 'extra3',
      headerName: 'Power',
      formType: 'checkbox',
      renderCell: params => (params.value ? '✓' : ''),
    },
  ],
}

export const TABS_TO_ICON: { [key: string]: any } = {
  summary: () => (
    <Box
      component="img"
      src={appIconUrl}
      alt="Example"
      sx={theme => ({
        width: '3em',
        height: '3em',
        verticalAlign: 'middle',
        filter: theme.palette.mode === 'light' ? 'invert(1) brightness(1.2)' : 'none',
      })}
    />
  ),
  sleep: CribIcon,
  diaper: BabyChangingStationIcon,
  nurse: PregnantWomanIcon,
  bottle: WaterDropIcon,
  pump: JoinInnerIcon,
}

// --- Helpers ---
function formatMsToMinSec(ms: number): string {
  if (!ms || ms <= 0) return '0s'

  const totalSeconds = Math.floor(ms / 1000)
  const mins = Math.floor(totalSeconds / 60)
  const secs = totalSeconds % 60

  if (mins > 0) return `${mins}m ${secs}s`
  return `${secs}s`
}

function getDaysWithData(filteredData: any[]): number {
  const uniqueDays = new Set<string>()

  filteredData.forEach(entry => {
    const localDay = dayjs(entry.start_time).format('YYYY-MM-DD')
    uniqueDays.add(localDay)
  })

  return uniqueDays.size
}

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
export const TABS: string[] = ['summary', 'bottle', 'diaper', 'pump', 'nurse', 'sleep']

// The raw index atom (setter takes only the index)
const selectedTabAtom = atom<string>(TABS[0])

/**
 * A derived atom that returns:
 * - tabIndex  (number)
 * - tab       (tab key string)
 * - icon      (component)
 * - getSummary(data, { startDate, endDate })
 *
 * The setter takes only the new index.
 */
export default atom(
  get => {
    const tab = get(selectedTabAtom)
    const Icon = TABS_TO_ICON[tab]

    const getSummary = (data: any[], opts: { startDate: Dayjs; endDate: Dayjs }) => {
      const fn = TAB_TO_SUMMARY_DATA[tab]
      return fn ? fn(data, opts) : []
    }

    return {
      tabIndex: TABS.indexOf(tab),
      tab,
      Icon,
      getSummary,
    }
  },
  (_get, set, newTab: string) => {
    set(selectedTabAtom, newTab)
  }
)
