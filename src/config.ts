import type { GridColDef } from '@mui/x-data-grid'
import AppIcon from './components/AppIcon'
import CribIcon from '@mui/icons-material/Crib'
import BabyChangingStationIcon from '@mui/icons-material/BabyChangingStation'
import PregnantWomanIcon from '@mui/icons-material/PregnantWoman'
import WaterDropIcon from '@mui/icons-material/WaterDrop'
import JoinInnerIcon from '@mui/icons-material/JoinInner'
import type { SvgIconComponent } from '@mui/icons-material'
import type { PaletteColorOptions } from '@mui/material'

type FieldEntry =
  | {
      formType: string
      selectFields?: never
      columnFields: GridColDef
    }
  | {
      formType: 'select'
      selectFields: string[]
      columnFields: GridColDef
    }

interface ConfigEntry {
  Icon: SvgIconComponent | typeof AppIcon
  lightPalette: PaletteColorOptions
  darkPalette: PaletteColorOptions
  fields?: FieldEntry[]
}

const config: Record<string, ConfigEntry> = {
  summary: {
    Icon: AppIcon,
    lightPalette: { main: '#4dabf5', contrastText: '#fff' },
    darkPalette: { main: '#42a5f5', contrastText: '#121212' },
  },

  bottle: {
    Icon: WaterDropIcon,
    lightPalette: { main: '#ffb74d', contrastText: '#121212' },
    darkPalette: { main: '#ffa726', contrastText: '#121212' },
    fields: [
      {
        formType: 'datePicker',
        columnFields: {
          field: 'start_time',
          headerName: 'Start',
        },
      },
      {
        formType: 'number',
        columnFields: {
          field: 'extra1',
          headerName: 'mL',
        },
      },
      {
        formType: 'checkbox',
        columnFields: {
          field: 'extra2',
          headerName: 'VitD',
        },
      },
    ],
  },

  diaper: {
    Icon: BabyChangingStationIcon,
    lightPalette: { main: '#81c784', contrastText: '#fff' },
    darkPalette: { main: '#66bb6a', contrastText: '#121212' },
    fields: [
      {
        formType: 'datePicker',
        columnFields: {
          field: 'start_time',
          headerName: 'Start',
        },
      },
      {
        formType: 'select',
        selectFields: ['Pee', 'Poo', 'Pee & Poo'],
        columnFields: {
          field: 'extra1',
          headerName: 'Type',
        },
      },
    ],
  },

  pump: {
    Icon: JoinInnerIcon,
    lightPalette: { main: '#e57373', contrastText: '#fff' },
    darkPalette: { main: '#ef5350', contrastText: '#ffffff' },
    fields: [
      {
        formType: 'datePicker',
        columnFields: {
          field: 'start_time',
          headerName: 'Start',
        },
      },
      {
        formType: 'number',
        columnFields: {
          field: 'extra2',
          headerName: 'mL',
        },
      },
      {
        formType: 'checkbox',
        columnFields: {
          field: 'extra3',
          headerName: 'Power',
        },
      },
    ],
  },

  nurse: {
    Icon: PregnantWomanIcon,
    lightPalette: { main: '#fff176', contrastText: '#121212' },
    darkPalette: { main: '#ffee58', contrastText: '#121212' },
    fields: [
      {
        formType: 'datePicker',
        columnFields: {
          field: 'start_time',
          headerName: 'Start',
        },
      },
      {
        formType: 'datePicker',
        columnFields: {
          field: 'end_time',
          headerName: 'End',
        },
      },
      {
        formType: 'select',
        selectFields: ['Left', 'Right', 'Both'],
        columnFields: {
          field: 'extra1',
          headerName: 'Side',
        },
      },
      {
        formType: 'checkbox',
        columnFields: {
          field: 'extra2',
          headerName: 'VitD',
        },
      },
    ],
  },

  sleep: {
    Icon: CribIcon,
    lightPalette: { main: '#b39ddb', contrastText: '#fff' },
    darkPalette: { main: '#9575cd', contrastText: '#121212' },
    fields: [
      {
        formType: 'datePicker',
        columnFields: {
          field: 'start_time',
          headerName: 'Start',
        },
      },
      {
        formType: 'datePicker',
        columnFields: {
          field: 'end_time',
          headerName: 'End',
        },
      },
      {
        formType: 'select',
        selectFields: ['Night Sleep', 'Nap'],
        columnFields: {
          field: 'extra1',
          headerName: 'Type',
        },
      },
    ],
  },
} as const

export default config
