import type { GridColDef } from '@mui/x-data-grid';
import AppIcon from './components/AppIcon';
import CribIcon from '@mui/icons-material/Crib';
import BabyChangingStationIcon from '@mui/icons-material/BabyChangingStation';
import PregnantWomanIcon from '@mui/icons-material/PregnantWoman';
import WaterDropIcon from '@mui/icons-material/WaterDrop';
import JoinInnerIcon from '@mui/icons-material/JoinInner';
import type { SvgIconComponent } from '@mui/icons-material';
import type { PaletteColorOptions } from '@mui/material';
import SummaryTab from './tabs/SummaryTab';
import DataTab from './tabs/DataTab';

type FieldEntry =
  | {
      formType: string;
      fullName: string;
      selectFields?: never;
      columnFields: GridColDef;
    }
  | {
      formType: 'select';
      fullName: string;
      selectFields: string[];
      columnFields: GridColDef;
    };

type SummaryItem = {
  peroid: 'events' | 'days';
  filters?: { [key: string]: (string | number | boolean)[] };
  fieldToAverage?: string;
};

export interface ConfigEntry {
  Icon: SvgIconComponent | typeof AppIcon;
  TabComponent?: React.FC;
  lightPalette: PaletteColorOptions;
  darkPalette: PaletteColorOptions;
  fields?: FieldEntry[];
  summayItems?: SummaryItem[];
}

const config: Record<string, ConfigEntry> = {
  summary: {
    Icon: AppIcon,
    TabComponent: SummaryTab,
    lightPalette: { main: '#4dabf5', contrastText: '#fff' },
    darkPalette: { main: '#42a5f5', contrastText: '#121212' },
  },

  bottle: {
    Icon: WaterDropIcon,
    TabComponent: DataTab,
    lightPalette: { main: '#ffb74d', contrastText: '#121212' },
    darkPalette: { main: '#ffa726', contrastText: '#121212' },
    summayItems: [
      { peroid: 'days', fieldToAverage: 'extra1' },
      { peroid: 'events', fieldToAverage: 'extra1' },
      { peroid: 'days' },
      { peroid: 'days', fieldToAverage: 'extra2' },
    ],
    fields: [
      {
        formType: 'datePicker',
        fullName: 'Start Time',
        columnFields: {
          field: 'start_time',
          headerName: 'Start',
        },
      },
      {
        formType: 'number',
        fullName: 'mL',
        columnFields: {
          field: 'extra1',
          headerName: 'mL',
        },
      },
      {
        formType: 'checkbox',
        fullName: 'Vitamin D',
        columnFields: {
          field: 'extra2',
          headerName: 'VitD',
        },
      },
    ],
  },

  diaper: {
    Icon: BabyChangingStationIcon,
    TabComponent: DataTab,
    lightPalette: { main: '#81c784', contrastText: '#fff' },
    darkPalette: { main: '#66bb6a', contrastText: '#121212' },
    summayItems: [
      { peroid: 'days', filters: { extra1: ['Pee', 'Pee & Poo'] } },
      { peroid: 'days', filters: { extra1: ['Poo', 'Pee & Poo'] } },
      { peroid: 'days' },
    ],
    fields: [
      {
        formType: 'datePicker',
        fullName: 'Start Time',
        columnFields: {
          field: 'start_time',
          headerName: 'Start',
        },
      },
      {
        formType: 'select',
        fullName: 'Diaper Type',
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
    TabComponent: DataTab,
    lightPalette: { main: '#e57373', contrastText: '#fff' },
    darkPalette: { main: '#ef5350', contrastText: '#fff' },
    summayItems: [
      { peroid: 'days', fieldToAverage: 'extra2' },
      { peroid: 'events', fieldToAverage: 'extra2' },
      { peroid: 'days' },
      { peroid: 'days', fieldToAverage: 'extra2', filters: { extra3: [true] } },
      { peroid: 'days', filters: { extra3: [true] } },
    ],
    fields: [
      {
        formType: 'datePicker',
        fullName: 'Start Time',
        columnFields: {
          field: 'start_time',
          headerName: 'Start',
        },
      },
      {
        formType: 'number',
        fullName: 'mL',
        columnFields: {
          field: 'extra2',
          headerName: 'mL',
        },
      },
      {
        formType: 'checkbox',
        fullName: 'Power Pump',
        columnFields: {
          field: 'extra3',
          headerName: 'Power',
        },
      },
    ],
  },
  nurse: {
    Icon: PregnantWomanIcon,
    TabComponent: DataTab,
    lightPalette: { main: '#fff176', contrastText: '#121212' },
    darkPalette: { main: '#ffee58', contrastText: '#121212' },
    summayItems: [
      { peroid: 'days', fieldToAverage: 'duration' },
      { peroid: 'events', fieldToAverage: 'duration' },
      { peroid: 'days' },
      { peroid: 'days', fieldToAverage: 'extra2' },
    ],
    fields: [
      {
        formType: 'datePicker',
        fullName: 'Start Time',
        columnFields: {
          field: 'start_time',
          headerName: 'Start',
        },
      },
      {
        formType: 'datePicker',
        fullName: 'End Time',
        columnFields: {
          field: 'end_time',
          headerName: 'End',
        },
      },
      {
        formType: 'select',
        fullName: 'Side',
        selectFields: ['Left', 'Right', 'Both'],
        columnFields: {
          field: 'extra1',
          headerName: 'Side',
        },
      },
      {
        formType: 'checkbox',
        fullName: 'Vitamin D',
        columnFields: {
          field: 'extra2',
          headerName: 'VitD',
        },
      },
    ],
  },
  sleep: {
    Icon: CribIcon,
    TabComponent: DataTab,
    lightPalette: { main: '#b39ddb', contrastText: '#fff' },
    darkPalette: { main: '#9575cd', contrastText: '#121212' },
    summayItems: [
      { peroid: 'days', fieldToAverage: 'duration' },
      {
        peroid: 'days',
        fieldToAverage: 'duration',
        filters: { extra1: ['Nap'] },
      },
      {
        peroid: 'days',
        fieldToAverage: 'duration',
        filters: { extra1: ['Night Sleep'] },
      },
    ],
    fields: [
      {
        formType: 'datePicker',
        fullName: 'Start Time',
        columnFields: {
          field: 'start_time',
          headerName: 'Start',
        },
      },
      {
        formType: 'datePicker',
        fullName: 'End Time',
        columnFields: {
          field: 'end_time',
          headerName: 'End',
        },
      },
      {
        formType: 'select',
        fullName: 'Sleep Type',
        selectFields: ['Night Sleep', 'Nap'],
        columnFields: {
          field: 'extra1',
          headerName: 'Type',
        },
      },
    ],
  },
} as const;

export default config;
