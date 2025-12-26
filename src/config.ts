import type { FC } from 'react';
import type { SvgIconComponent } from '@mui/icons-material';
import BabyChangingStationIcon from '@mui/icons-material/BabyChangingStation';
import BathtubIcon from '@mui/icons-material/Bathtub';
import CribIcon from '@mui/icons-material/Crib';
import JoinInnerIcon from '@mui/icons-material/JoinInner';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import PregnantWomanIcon from '@mui/icons-material/PregnantWoman';
import ScaleIcon from '@mui/icons-material/Scale';
import StraightenIcon from '@mui/icons-material/Straighten';
import WaterDropIcon from '@mui/icons-material/WaterDrop';

import type { PaletteColorOptions } from '@mui/material';
import type { GridColDef } from '@mui/x-data-grid';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import AppIcon from './components/AppIcon';
import DataTab from './tabs/DataTab';
import SummaryTab from './tabs/SummaryTab';
import type { BabyData } from './types';
import formatMsToMinSec from './utils/formatMsToMinSec';
import getAverages from './utils/getAverages';
import getFirstAndLastEntry from './utils/getFirstAndLastEntry';
import gramsToLB from './utils/gramsToLB';
import inchesToFootInches from './utils/inchesToFootInches';
import mlToOz from './utils/mlToOz';

type FieldEntry =
  | {
      formType: string;
      selectFields?: never;
      columnFields: GridColDef;
    }
  | {
      formType: 'select';
      selectFields: string[];
      columnFields: GridColDef;
    };

export interface ConfigEntry {
  Icon: SvgIconComponent | typeof AppIcon;
  TabComponent?: FC;
  lightPalette: PaletteColorOptions;
  darkPalette: PaletteColorOptions;
  fields?: FieldEntry[];
  getSummary?: (data: BabyData, startDate: Dayjs, endDate: Dayjs) => string[];
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
    getSummary: (data: BabyData, startDate: Dayjs, endDate: Dayjs) => {
      const { timeAgo } = getFirstAndLastEntry(data.bottle);

      const averages = getAverages(
        data,
        ['bottle'],
        startDate,
        endDate,
        'extra1',
      );
      if (!averages) return [];
      const { average, daysAverage, averagePerDay } = averages;

      return [
        `Average ${daysAverage}mL (${mlToOz(daysAverage)}oz) per day`,
        `Average ${average}mL (${mlToOz(average)}oz) per bottle`,
        `Average ${averagePerDay} bottle(s) per day`,
        `Last bottle was: ${timeAgo} ago`,
      ];
    },
    fields: [
      {
        formType: 'datePicker',
        columnFields: { field: 'start_time', headerName: 'Start' },
      },
      {
        formType: 'number',
        columnFields: { field: 'extra1', headerName: 'mL' },
      },
      {
        formType: 'checkbox',
        columnFields: { field: 'extra2', headerName: 'VitD' },
      },
    ],
  },

  diaper: {
    Icon: BabyChangingStationIcon,
    TabComponent: DataTab,
    lightPalette: { main: '#C8E6C9', contrastText: '#121212' },
    darkPalette: { main: '#A5D6A7', contrastText: '#121212' },
    getSummary: (data: BabyData, startDate: Dayjs, endDate: Dayjs) => {
      const { timeAgo } = getFirstAndLastEntry(data.diaper);
      const summaries: string[] = [];

      const peeAverages = getAverages(
        data,
        ['diaper'],
        startDate,
        endDate,
        'extra1',
        { extra1: ['Pee', 'Pee & Poo'] },
      );
      if (peeAverages) {
        const { averagePerDay } = peeAverages;
        summaries.push(`Average ${averagePerDay} pee(s) per day`);
      }

      const pooAverages = getAverages(
        data,
        ['diaper'],
        startDate,
        endDate,
        'extra1',
        { extra1: ['Poo', 'Pee & Poo'] },
      );
      if (pooAverages) {
        const { averagePerDay } = pooAverages;
        summaries.push(`Average ${averagePerDay} poo(s) per day`);
      }

      const diaperAverages = getAverages(
        data,
        ['diaper'],
        startDate,
        endDate,
        'extra1',
      );
      if (diaperAverages) {
        const { averagePerDay } = diaperAverages;
        summaries.push(`Average ${averagePerDay} diaper(s) per day`);
      }

      if (summaries.length > 0) {
        summaries.push(`Last diaper was: ${timeAgo} ago`);
      }

      return summaries;
    },
    fields: [
      {
        formType: 'datePicker',
        columnFields: { field: 'start_time', headerName: 'Start' },
      },
      {
        formType: 'select',
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
    getSummary: (data: BabyData, startDate: Dayjs, endDate: Dayjs) => {
      const { timeAgo } = getFirstAndLastEntry(data.pump);
      let summaries: string[] = [];

      const averages = getAverages(
        data,
        ['pump'],
        startDate,
        endDate,
        'extra2',
      );
      if (averages) {
        const { average, daysAverage, averagePerDay } = averages;
        summaries = summaries.concat([
          `Average ${daysAverage}mL (${mlToOz(daysAverage)}oz) per day`,
          `Average ${average}mL (${mlToOz(average)}oz) per pump`,
          `Average ${averagePerDay} pump(s) per day`,
        ]);
      }

      const powerAverages = getAverages(
        data,
        ['pump'],
        startDate,
        endDate,
        'extra2',
        { extra3: [true] },
      );
      if (powerAverages) {
        const { average, averagePerDay } = powerAverages;
        summaries = summaries.concat([
          `Average ${average}mL (${mlToOz(average)}oz) per power pump`,
          `Average ${averagePerDay} power pump(s) per day`,
        ]);
      }

      if (summaries.length > 0) {
        summaries.push(`Last pump was: ${timeAgo} ago`);
      }

      return summaries;
    },
    fields: [
      {
        formType: 'datePicker',
        columnFields: { field: 'start_time', headerName: 'Start' },
      },
      {
        formType: 'number',
        columnFields: { field: 'extra2', headerName: 'mL' },
      },
      {
        formType: 'checkbox',
        columnFields: { field: 'extra3', headerName: 'Power' },
      },
    ],
  },

  nurse: {
    Icon: PregnantWomanIcon,
    TabComponent: DataTab,
    lightPalette: { main: '#FFF9C4', contrastText: '#121212' },
    darkPalette: { main: '#FFF59D', contrastText: '#121212' },
    getSummary: (data: BabyData, startDate: Dayjs, endDate: Dayjs) => {
      const { timeAgo } = getFirstAndLastEntry(data.nurse);
      const averages = getAverages(
        data,
        ['nurse'],
        startDate,
        endDate,
        'duration',
      );
      if (!averages) return [];
      const { average, daysAverage, averagePerDay } = averages;

      return [
        `Average ${formatMsToMinSec(daysAverage)} per day`,
        `Average ${formatMsToMinSec(average)} per nurse`,
        `Average ${averagePerDay} nurse(s) per day`,
        `Last nurse was: ${timeAgo} ago`,
      ];
    },
    fields: [
      {
        formType: 'datePicker',
        columnFields: { field: 'start_time', headerName: 'Start' },
      },
      {
        formType: 'datePicker',
        columnFields: { field: 'end_time', headerName: 'End' },
      },
      {
        formType: 'select',
        selectFields: ['Left', 'Right', 'Both'],
        columnFields: { field: 'extra1', headerName: 'Side' },
      },
      {
        formType: 'checkbox',
        columnFields: { field: 'extra2', headerName: 'VitD' },
      },
    ],
  },

  sleep: {
    Icon: CribIcon,
    TabComponent: DataTab,
    lightPalette: { main: '#D1C4E9', contrastText: '#121212' },
    darkPalette: { main: '#B39DDB', contrastText: '#121212' },
    getSummary: (data: BabyData, startDate: Dayjs, endDate: Dayjs) => {
      const { timeAgo } = getFirstAndLastEntry(data.sleep);
      const summaries: string[] = [];

      const averages = getAverages(
        data,
        ['sleep'],
        startDate,
        endDate,
        'duration',
      );
      if (averages) {
        const { averagePerDay } = averages;
        summaries.push(
          `Average ${formatMsToMinSec(averagePerDay)} sleep per day`,
        );
      }

      const napAverages = getAverages(
        data,
        ['sleep'],
        startDate,
        endDate,
        'duration',
        { extra1: ['Nap'] },
      );
      if (napAverages) {
        const { averagePerDay } = napAverages;
        summaries.push(
          `Average ${formatMsToMinSec(averagePerDay)} nap time per day`,
        );
      }

      const nightSleepAverages = getAverages(
        data,
        ['sleep'],
        startDate,
        endDate,
        'duration',
        { extra1: ['Night Sleep'] },
      );
      if (nightSleepAverages) {
        const { averagePerDay } = nightSleepAverages;
        summaries.push(
          `Average ${formatMsToMinSec(averagePerDay)} night sleep per day`,
        );
      }

      if (summaries.length > 0) {
        summaries.push(`Last sleep was: ${timeAgo} ago`);
      }

      return summaries;
    },
    fields: [
      {
        formType: 'datePicker',
        columnFields: { field: 'start_time', headerName: 'Start' },
      },
      {
        formType: 'datePicker',
        columnFields: { field: 'end_time', headerName: 'End' },
      },
      {
        formType: 'select',
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
    getSummary: (data: BabyData) => {
      const { latestEntry } = getFirstAndLastEntry(data.bath);
      if (!latestEntry) {
        return [];
      }

      return [
        `Last bath was ${dayjs(latestEntry.start_time).format('dddd MMMM Do YYYY [at] h:mm a')}`,
      ];
    },
    fields: [
      {
        formType: 'datePicker',
        columnFields: { field: 'start_time', headerName: 'Start' },
      },
    ],
  },

  weight: {
    Icon: ScaleIcon,
    TabComponent: DataTab,
    lightPalette: { main: '#D7CCC8', contrastText: '#121212' },
    darkPalette: { main: '#BCAAA4', contrastText: '#121212' },
    getSummary: (data: BabyData) => {
      const summaries: string[] = [];
      const { firstEntry, latestEntry } = getFirstAndLastEntry(data.weight);
      if (latestEntry) {
        const grams = latestEntry.extra1 as number;
        summaries.push(
          `Latest weight: ${grams} grams (${gramsToLB(grams)}) on ${new Date(latestEntry.start_time).toLocaleDateString()}`,
        );
      }

      if (firstEntry) {
        const grams = firstEntry.extra1 as number;
        summaries.push(`Birth weight: ${grams} grams (${gramsToLB(grams)})`);
      }

      return summaries;
    },
    fields: [
      {
        formType: 'datePicker',
        columnFields: { field: 'start_time', headerName: 'Start' },
      },
      {
        formType: 'number',
        columnFields: { field: 'extra1', headerName: 'grams' },
      },
    ],
  },

  height: {
    Icon: StraightenIcon,
    TabComponent: DataTab,
    lightPalette: { main: '#FFE0B2', contrastText: '#121212' },
    darkPalette: { main: '#FFCC80', contrastText: '#121212' },
    getSummary: (data: BabyData) => {
      const summaries: string[] = [];
      const { firstEntry, latestEntry } = getFirstAndLastEntry(data.height);
      if (latestEntry) {
        const inches = latestEntry.extra1 as number;
        summaries.push(
          `Latest height: ${inches} " (${inchesToFootInches(inches)}) on ${new Date(latestEntry.start_time).toLocaleDateString()}`,
        );
      }

      if (firstEntry) {
        const inches = firstEntry.extra1 as number;
        summaries.push(
          `Birth height: ${inches} " (${inchesToFootInches(inches)})`,
        );
      }

      return summaries;
    },
    fields: [
      {
        formType: 'datePicker',
        columnFields: { field: 'start_time', headerName: 'Start' },
      },
      {
        formType: 'number',
        columnFields: { field: 'extra1', headerName: 'inches' },
      },
    ],
  },

  miscellaneous: {
    Icon: MoreHorizIcon,
    lightPalette: { main: '#E0E0E0', contrastText: '#121212' },
    darkPalette: { main: '#616161', contrastText: '#FFFFFF' },
    getSummary: (data: BabyData, startDate: Dayjs, endDate: Dayjs) => {
      const summaries: string[] = [];

      const vitDaverages = getAverages(
        data,
        ['bottle', 'nurse'],
        startDate,
        endDate,
        'extra2',
        { extra2: [true] },
      );
      if (vitDaverages) {
        const { averagePerDay } = vitDaverages;
        summaries.push(`Average ${averagePerDay} Vitamin D per day`);
      }

      const bottleAverages = getAverages(
        data,
        ['bottle'],
        startDate,
        endDate,
        'extra1',
      );
      const pumpAverages = getAverages(
        data,
        ['pump'],
        startDate,
        endDate,
        'extra2',
      );
      if (bottleAverages && pumpAverages) {
        const { daysAverage: bottleDaysAverage } = bottleAverages;
        const { daysAverage: pumpDaysAverage } = pumpAverages;
        const breastMilkPercent = Math.min(
          Math.round((pumpDaysAverage / bottleDaysAverage) * 100),
          100,
        );

        summaries.push(`Bottle breast milk percent: ${breastMilkPercent}%`);
      }

      return summaries;
    },
  },
} as const;

export default config;
