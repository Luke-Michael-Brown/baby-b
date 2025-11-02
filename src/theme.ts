import { useAtomValue } from 'jotai';
import { createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';
import selectedTabAtom, { TABS, TABS_TO_COLOR } from './atoms/selectedTabAtom';

declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary'];
    blue: Palette['primary'];
    purple: Palette['primary'];
    green: Palette['primary'];
    yellow: Palette['primary'];
    red: Palette['primary'];
    orange: Palette['primary'];
  }
  interface PaletteOptions {
    neutral?: PaletteOptions['primary'];
    blue?: PaletteOptions['primary'];
    purple?: PaletteOptions['primary'];
    green?: PaletteOptions['primary'];
    yellow?: PaletteOptions['primary'];
    red?: PaletteOptions['primary'];
    orange?: PaletteOptions['primary'];
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
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
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
      styleOverrides: {
        root: {
          transition: 'background-color 0.3s ease',
        },
      },
    },
  },
};

// Light mode palette (subtler)
const lightPalette: ThemeOptions['palette'] = {
  mode: 'light',
  primary: { main: '#1976d2' },
  secondary: { main: '#8e24aa' },
  neutral: { main: '#6b7280', contrastText: '#fff' },
  blue: { main: '#4f83cc', contrastText: '#fff' },
  purple: { main: '#9c5ca3', contrastText: '#fff' },
  green: { main: '#4caf70', contrastText: '#fff' },
  yellow: { main: '#fddc69', contrastText: '#000' },
  red: { main: '#e57373', contrastText: '#fff' },
  orange: { main: '#fb8c42', contrastText: '#fff' },
  background: { default: '#f9f9f9', paper: '#ffffff' },
  divider: '#e0e0e0',
};

// Dark mode palette (subtler)
const darkPalette: ThemeOptions['palette'] = {
  mode: 'dark',
  primary: { main: '#90caf9', contrastText: '#121212' },   // soft blue
  secondary: { main: '#b785c4', contrastText: '#121212' }, // richer purple
  neutral: { main: '#64748b', contrastText: '#ffffff' },   // darker gray-blue
  blue: { main: '#4a90e2', contrastText: '#ffffff' },      // deeper blue
  purple: { main: '#8e44ad', contrastText: '#ffffff' },    // darker purple
  green: { main: '#43a047', contrastText: '#ffffff' },     // deeper green
  yellow: { main: '#fbc02d', contrastText: '#121212' },    // richer gold
  red: { main: '#e53935', contrastText: '#ffffff' },       // stronger red
  orange: { main: '#fb8c00', contrastText: '#ffffff' },    // deeper orange
  background: { default: '#101010', paper: '#1c1c1c' },   // very dark backgrounds
  divider: 'rgba(255,255,255,0.2)',                       // slightly brighter divider
  text: {
    primary: '#ffffff', // main text
    secondary: '#cfd8dc', // secondary text
    disabled: '#78909c', // disabled text
  },
};

// Theme builder function
export const useTheme = (mode: 'light' | 'dark') => {
  const selectedTab = useAtomValue(selectedTabAtom);
  const tab = TABS[selectedTab];
  const colorKey = TABS_TO_COLOR[tab]; // e.g., 'blue', 'red', etc.

  const basePalette = mode === 'light' ? lightPalette : darkPalette;

  // Override primary with selected tab color
  const dynamicPalette = {
    ...basePalette,
    primary: basePalette[colorKey as keyof typeof basePalette] || basePalette.primary,
  };

  return createTheme(deepmerge(baseTheme, { palette: dynamicPalette }));
};
