import type { FC } from 'react';
import type { SvgIconComponent } from '@mui/icons-material';
import BabyChangingStationIcon from '@mui/icons-material/BabyChangingStation';
import BathtubIcon from '@mui/icons-material/Bathtub';
import CribIcon from '@mui/icons-material/Crib';
import JoinInnerIcon from '@mui/icons-material/JoinInner';
import PregnantWomanIcon from '@mui/icons-material/PregnantWoman';
import ScaleIcon from '@mui/icons-material/Scale';
import StraightenIcon from '@mui/icons-material/Straighten';
import WaterDropIcon from '@mui/icons-material/WaterDrop';

import type { PaletteColorOptions } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import AppIcon from './components/AppIcon';
import DataTab from './tabs/DataTab';
import SummaryTab from './tabs/SummaryTab';

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
  summaryType: 'eventsAverage' | 'daysAverage' | 'latestValue' | 'firstValue';
  filters?: { [key: string]: (string | number | boolean)[] };
  fieldToSummarize?: string;
};

export interface ConfigEntry {
  Icon: SvgIconComponent | typeof AppIcon;
  TabComponent?: FC;
  lightPalette: PaletteColorOptions;
  darkPalette: PaletteColorOptions;
  fields?: FieldEntry[];
  summayItems?: SummaryItem[];
}

const config: Record<string, ConfigEntry> = {
  summary: {
    Icon: AppIcon,
    TabComponent: SummaryTab,
    lightPalette: { main: '#B7DBFF', contrastText: '#121212' },
    darkPalette: { main: '#FAD1E3', contrastText: '#121212' },
  },

  bottle: {
    Icon: WaterDropIcon,
    TabComponent: DataTab,
    lightPalette: { main: '#B2EBF2', contrastText: '#121212' },
    darkPalette: { main: '#80DEEA', contrastText: '#121212' },
    summayItems: [
      { summaryType: 'daysAverage', fieldToSummarize: 'extra1' },
      { summaryType: 'eventsAverage', fieldToSummarize: 'extra1' },
      { summaryType: 'daysAverage' },
      { summaryType: 'daysAverage', fieldToSummarize: 'extra2' },
    ],
    fields: [
      {
        formType: 'datePicker',
        fullName: 'Start Time',
        columnFields: { field: 'start_time', headerName: 'Start' },
      },
      {
        formType: 'number',
        fullName: 'mL',
        columnFields: { field: 'extra1', headerName: 'mL' },
      },
      {
        formType: 'checkbox',
        fullName: 'Vitamin D',
        columnFields: { field: 'extra2', headerName: 'VitD' },
      },
    ],
  },

  diaper: {
    Icon: BabyChangingStationIcon,
    TabComponent: DataTab,
    lightPalette: { main: '#C8E6C9', contrastText: '#121212' },
    darkPalette: { main: '#A5D6A7', contrastText: '#121212' },
    summayItems: [
      { summaryType: 'daysAverage', filters: { extra1: ['Pee', 'Pee & Poo'] } },
      { summaryType: 'daysAverage', filters: { extra1: ['Poo', 'Pee & Poo'] } },
      { summaryType: 'daysAverage' },
    ],
    fields: [
      {
        formType: 'datePicker',
        fullName: 'Start Time',
        columnFields: { field: 'start_time', headerName: 'Start' },
      },
      {
        formType: 'select',
        fullName: 'Diaper Type',
        selectFields: ['Pee', 'Poo', 'Pee & Poo'],
        columnFields: { field: 'extra1', headerName: 'Type' },
      },
    ],
  },

  pump: {
    Icon: JoinInnerIcon,
    TabComponent: DataTab,
    lightPalette: { main: '#FFCCBC', contrastText: '#121212' },
    darkPalette: { main: '#FFAB91', contrastText: '#121212' },
    summayItems: [
      { summaryType: 'daysAverage', fieldToSummarize: 'extra2' },
      { summaryType: 'eventsAverage', fieldToSummarize: 'extra2' },
      { summaryType: 'daysAverage' },
      {
        summaryType: 'daysAverage',
        fieldToSummarize: 'extra2',
        filters: { extra3: [true] },
      },
      { summaryType: 'daysAverage', filters: { extra3: [true] } },
    ],
    fields: [
      {
        formType: 'datePicker',
        fullName: 'Start Time',
        columnFields: { field: 'start_time', headerName: 'Start' },
      },
      {
        formType: 'number',
        fullName: 'mL',
        columnFields: { field: 'extra2', headerName: 'mL' },
      },
      {
        formType: 'checkbox',
        fullName: 'Power Pump',
        columnFields: { field: 'extra3', headerName: 'Power' },
      },
    ],
  },

  nurse: {
    Icon: PregnantWomanIcon,
    TabComponent: DataTab,
    lightPalette: { main: '#FFF9C4', contrastText: '#121212' },
    darkPalette: { main: '#FFF59D', contrastText: '#121212' },
    summayItems: [
      { summaryType: 'daysAverage', fieldToSummarize: 'duration' },
      { summaryType: 'eventsAverage', fieldToSummarize: 'duration' },
      { summaryType: 'daysAverage' },
      { summaryType: 'daysAverage', fieldToSummarize: 'extra2' },
    ],
    fields: [
      {
        formType: 'datePicker',
        fullName: 'Start Time',
        columnFields: { field: 'start_time', headerName: 'Start' },
      },
      {
        formType: 'datePicker',
        fullName: 'End Time',
        columnFields: { field: 'end_time', headerName: 'End' },
      },
      {
        formType: 'select',
        fullName: 'Side',
        selectFields: ['Left', 'Right', 'Both'],
        columnFields: { field: 'extra1', headerName: 'Side' },
      },
      {
        formType: 'checkbox',
        fullName: 'Vitamin D',
        columnFields: { field: 'extra2', headerName: 'VitD' },
      },
    ],
  },

  sleep: {
    Icon: CribIcon,
    TabComponent: DataTab,
    lightPalette: { main: '#D1C4E9', contrastText: '#121212' },
    darkPalette: { main: '#B39DDB', contrastText: '#121212' },
    summayItems: [
      { summaryType: 'daysAverage', fieldToSummarize: 'duration' },
      {
        summaryType: 'daysAverage',
        fieldToSummarize: 'duration',
        filters: { extra1: ['Nap'] },
      },
      {
        summaryType: 'daysAverage',
        fieldToSummarize: 'duration',
        filters: { extra1: ['Night Sleep'] },
      },
    ],
    fields: [
      {
        formType: 'datePicker',
        fullName: 'Start Time',
        columnFields: { field: 'start_time', headerName: 'Start' },
      },
      {
        formType: 'datePicker',
        fullName: 'End Time',
        columnFields: { field: 'end_time', headerName: 'End' },
      },
      {
        formType: 'select',
        fullName: 'Sleep Type',
        selectFields: ['Night Sleep', 'Nap'],
        columnFields: { field: 'extra1', headerName: 'Type' },
      },
    ],
  },

  bath: {
    Icon: BathtubIcon,
    TabComponent: DataTab,
    lightPalette: { main: '#C5CAE9', contrastText: '#121212' },
    darkPalette: { main: '#9FA8DA', contrastText: '#121212' },
    summayItems: [
      { summaryType: 'latestValue', fieldToSummarize: 'start_time' },
    ],
    fields: [
      {
        formType: 'datePicker',
        fullName: '',
        columnFields: { field: 'start_time', headerName: 'Start' },
      },
    ],
  },

  weight: {
    Icon: ScaleIcon,
    TabComponent: DataTab,
    lightPalette: { main: '#D7CCC8', contrastText: '#121212' },
    darkPalette: { main: '#BCAAA4', contrastText: '#121212' },
    summayItems: [
      { summaryType: 'latestValue', fieldToSummarize: 'extra1' },
      { summaryType: 'firstValue', fieldToSummarize: 'extra1' },
    ],
    fields: [
      {
        formType: 'datePicker',
        fullName: 'Start Time',
        columnFields: { field: 'start_time', headerName: 'Start' },
      },
      {
        formType: 'number',
        fullName: 'grams',
        columnFields: { field: 'extra1', headerName: 'grams' },
      },
    ],
  },

  height: {
    Icon: StraightenIcon,
    TabComponent: DataTab,
    lightPalette: { main: '#FFE0B2', contrastText: '#121212' },
    darkPalette: { main: '#FFCC80', contrastText: '#121212' },
    summayItems: [
      { summaryType: 'latestValue', fieldToSummarize: 'extra1' },
      { summaryType: 'firstValue', fieldToSummarize: 'extra1' },
    ],
    fields: [
      {
        formType: 'datePicker',
        fullName: 'Start Time',
        columnFields: { field: 'start_time', headerName: 'Start' },
      },
      {
        formType: 'number',
        fullName: '"',
        columnFields: { field: 'extra1', headerName: 'inches' },
      },
    ],
  },
} as const;

export default config;
