// This configuration file defines the structure and settings for various tabs
// in the baby tracking application.
// It includes type definitions for field entries and summary items, and exports
// a config object that maps tab names to their respective configurations,
// including Material-UI icons, tab components, color palettes for light and dark
// themes, and arrays of summary items for data aggregation.
// This centralizes the app's UI and data handling logic for different baby care
// activities such as feeding, diapering, sleeping, and measurements.

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
    darkPalette: { main: '#F7B2CD', contrastText: '#121212' },
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
    fields: [],
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
    fields: [],
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
    fields: [],
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
    fields: [],
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
    fields: [],
  },

  bath: {
    Icon: BathtubIcon,
    TabComponent: DataTab,
    lightPalette: { main: '#C5CAE9', contrastText: '#121212' },
    darkPalette: { main: '#9FA8DA', contrastText: '#121212' },
    summayItems: [
      { summaryType: 'latestValue', fieldToSummarize: 'start_time' },
    ],
    fields: [],
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
    fields: [],
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
    fields: [],
  },
} as const;

export default config;
