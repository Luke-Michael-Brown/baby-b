import { useAtomValue } from 'jotai';
import { createTheme } from '@mui/material/styles';
import type { PaletteColorOptions, ThemeOptions } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';
import selectedTabAtom from './atoms/selectedTabAtom';
import config from './config';

declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary'];
    summary: Palette['primary'];
    sleep: Palette['primary'];
    diaper: Palette['primary'];
    nurse: Palette['primary'];
    pump: Palette['primary'];
    bottle: Palette['primary'];
  }
  interface PaletteOptions {
    neutral?: PaletteOptions['primary'];
    summary?: PaletteOptions['primary'];
    sleep?: PaletteOptions['primary'];
    diaper?: PaletteOptions['primary'];
    nurse?: PaletteOptions['primary'];
    pump?: PaletteOptions['primary'];
    bottle?: PaletteOptions['primary'];
  }
}

// Base theme shared between light and dark
const baseTheme: ThemeOptions = {
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: { fontWeight: 600 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 500 },
    body1: { fontSize: 16 },
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: { root: { textTransform: 'none', borderRadius: 8 } },
    },
    MuiButtonGroup: {
      styleOverrides: {
        root: ({ theme }) => ({
          borderRadius: 8,
          '& .MuiButtonGroup-grouped:not(:last-of-type)': {
            borderColor: theme.palette.divider,
          },
        }),
      },
    },
    MuiPaper: {
      styleOverrides: { root: { transition: 'background-color 0.3s ease' } },
    },
  },
};

type TabPallet = { [key: string]: PaletteColorOptions };

const lightPalette: TabPallet = Object.keys(config).reduce(
  (acc, key) => {
    const entry = config[key];
    acc[key] = entry.lightPalette;
    return acc;
  },
  {
    mode: 'light',
    primary: { main: '#1976d2' },
    secondary: { main: '#8e24aa' },
    background: { default: '#f9f9f9', paper: '#ffffff' },
    divider: '#e0e0e0',
  } as TabPallet,
);

const darkPalette: TabPallet = Object.keys(config).reduce(
  (acc, key) => {
    const entry = config[key];
    acc[key] = entry.darkPalette;
    return acc;
  },
  {
    mode: 'dark',
    primary: { main: '#90caf9', contrastText: '#121212' },
    secondary: { main: '#b785c4', contrastText: '#121212' },
    background: { default: '#101010', paper: '#1c1c1c' },
    divider: 'rgba(255,255,255,0.2)',
    text: { primary: '#ffffff', secondary: '#cfd8dc', disabled: '#78909c' },
  } as TabPallet,
);

// Theme builder function
export const useTheme = (mode: 'light' | 'dark') => {
  const { tab } = useAtomValue(selectedTabAtom);

  const basePalette = mode === 'light' ? lightPalette : darkPalette;

  const dynamicPalette = {
    ...basePalette,
    primary:
      basePalette[tab as keyof typeof basePalette] || basePalette.primary,
  };

  return createTheme(deepmerge(baseTheme, { palette: dynamicPalette }));
};
