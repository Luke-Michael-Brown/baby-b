import type { GridColDef } from '@mui/x-data-grid'
import AppIcon from './components/AppIcon'
import CribIcon from '@mui/icons-material/Crib'
import BabyChangingStationIcon from '@mui/icons-material/BabyChangingStation'
import PregnantWomanIcon from '@mui/icons-material/PregnantWoman'
import WaterDropIcon from '@mui/icons-material/WaterDrop'
import JoinInnerIcon from '@mui/icons-material/JoinInner'
import type { SvgIconComponent } from '@mui/icons-material'
import type { PaletteColorOptions } from '@mui/material'

type COLUMN_ENTRY = GridColDef & {
  entryConfig?: { formType?: string } | { formType: 'select'; selectFields: string[] }
}

interface ConfigEntry {
  Icon: SvgIconComponent | typeof AppIcon
  lightPalette: PaletteColorOptions
  darkPalette: PaletteColorOptions
  columns?: COLUMN_ENTRY[]
}

const config: { [key: string]: ConfigEntry } = {
  summary: {
    Icon: AppIcon,
    lightPalette: { main: '#4dabf5', contrastText: '#fff' },
    darkPalette: { main: '#42a5f5', contrastText: '#121212' },
  },
  bottle: {
    Icon: WaterDropIcon,
    lightPalette: { main: '#ffb74d', contrastText: '#121212' },
    darkPalette: { main: '#ffa726', contrastText: '#121212' },
    columns: [
      {
        flex: 100,
        field: 'start_time',
        headerName: 'Start',
        entryConfig: {
          formType: 'datePicker',
        },
      },
      {
        flex: 60,
        field: 'extra1',
        headerName: 'mL',
        entryConfig: {
          formType: 'number',
        },
      },
      {
        flex: 60,
        field: 'extra2',
        headerName: 'VitD',
        entryConfig: {
          formType: 'checkbox',
        },
      },
    ],
  },
  diaper: {
    Icon: BabyChangingStationIcon,
    lightPalette: { main: '#81c784', contrastText: '#fff' },
    darkPalette: { main: '#66bb6a', contrastText: '#121212' },
    columns: [
      {
        flex: 100,
        field: 'start_time',
        headerName: 'Start',
        entryConfig: {
          formType: 'datePicker',
        },
      },
      {
        flex: 100,
        field: 'extra1',
        headerName: 'Type',
        entryConfig: {
          formType: 'select',
          selectFields: ['Pee', 'Poo', 'Pee & Poo'],
        },
      },
    ],
  },
  pump: {
    Icon: JoinInnerIcon,
    lightPalette: { main: '#e57373', contrastText: '#fff' },
    darkPalette: { main: '#ef5350', contrastText: '#ffffff' },
    columns: [
      {
        flex: 100,
        field: 'start_time',
        headerName: 'Start',
        entryConfig: {
          formType: 'datePicker',
        },
      },
      {
        flex: 60,
        field: 'extra2',
        headerName: 'mL',
        entryConfig: {
          formType: 'number',
        },
      },
      {
        flex: 60,
        field: 'extra3',
        headerName: 'Power',
        entryConfig: {
          formType: 'checkbox',
        },
      },
    ],
  },
  nurse: {
    Icon: PregnantWomanIcon,
    lightPalette: { main: '#fff176', contrastText: '#121212' },
    darkPalette: { main: '#ffee58', contrastText: '#121212' },
    columns: [
      {
        flex: 100,
        field: 'start_time',
        headerName: 'Start',
        entryConfig: {
          formType: 'datePicker',
        },
      },
      {
        flex: 100,
        field: 'end_time',
        headerName: 'End',
        entryConfig: {
          formType: 'datePicker',
        },
      },
      {
        flex: 100,
        field: 'extra1',
        headerName: 'Side',
        entryConfig: {
          formType: 'select',
          selectFields: ['Left', 'Right', 'Both'],
        },
      },
      {
        flex: 90,
        field: 'extra2',
        headerName: 'VitD',
        entryConfig: {
          formType: 'checkbox',
        },
      },
    ],
  },
  sleep: {
    Icon: CribIcon,
    lightPalette: { main: '#b39ddb', contrastText: '#fff' },
    darkPalette: { main: '#9575cd', contrastText: '#121212' },
    columns: [
      {
        flex: 100,
        field: 'start_time',
        headerName: 'Start',
        entryConfig: {
          formType: 'datePicker',
        },
      },
      {
        flex: 100,
        field: 'end_time',
        headerName: 'End',
        entryConfig: {
          formType: 'datePicker',
        },
      },
      {
        flex: 100,
        field: 'extra1',
        headerName: 'Type',
        entryConfig: {
          formType: 'select',
          selectFields: ['Night Sleep', 'Nap'],
        },
      },
    ],
  },
} as const

export default config
