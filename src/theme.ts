import { useAtomValue } from 'jotai';
import { createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';
import selectedTabAtom, { TABS } from './atoms/selectedTabAtom';

declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary'];
    summary: Palette['primary'];
    sleep: Palette['primary'];
    diaper: Palette['primary'];
    nursing: Palette['primary'];
    pumping: Palette['primary'];
    bottle: Palette['primary'];
  }
  interface PaletteOptions {
    neutral?: PaletteOptions['primary'];
    summary?: PaletteOptions['primary'];
    sleep?: PaletteOptions['primary'];
    diaper?: PaletteOptions['primary'];
    nursing?: PaletteOptions['primary'];
    pumping?: PaletteOptions['primary'];
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
          '& .MuiButtonGroup-grouped:not(:last-of-type)': { borderColor: theme.palette.divider },
        }),
      },
    },
    MuiPaper: {
      styleOverrides: { root: { transition: 'background-color 0.3s ease' } },
    },
  },
};

// Light mode palette
const lightPalette: ThemeOptions['palette'] = {
  mode: 'light',
  primary: { main: '#1976d2' },
  secondary: { main: '#8e24aa' },
  neutral: { main: '#6b7280', contrastText: '#fff' },
  summary: { main: '#4dabf5', contrastText: '#fff' },    // subtle blue
  sleep: { main: '#b39ddb', contrastText: '#fff' },      // soft purple
  diaper: { main: '#81c784', contrastText: '#fff' },     // soft green
  nursing: { main: '#fff176', contrastText: '#121212' }, // muted yellow
  pumping: { main: '#e57373', contrastText: '#fff' },    // soft red
  bottle: { main: '#ffb74d', contrastText: '#121212' },  // soft orange
  background: { default: '#f9f9f9', paper: '#ffffff' },
  divider: '#e0e0e0',
};

// Dark mode palette
const darkPalette: ThemeOptions['palette'] = {
  mode: 'dark',
  primary: { main: '#90caf9', contrastText: '#121212' },
  secondary: { main: '#b785c4', contrastText: '#121212' },
  neutral: { main: '#64748b', contrastText: '#ffffff' },
  summary: { main: '#42a5f5', contrastText: '#121212' },    // gentle blue
  sleep: { main: '#9575cd', contrastText: '#121212' },      // muted purple
  diaper: { main: '#66bb6a', contrastText: '#121212' },     // muted green
  nursing: { main: '#ffee58', contrastText: '#121212' },    // soft yellow
  pumping: { main: '#ef5350', contrastText: '#ffffff' },    // muted red
  bottle: { main: '#ffa726', contrastText: '#121212' },     // soft orange
  background: { default: '#101010', paper: '#1c1c1c' },
  divider: 'rgba(255,255,255,0.2)',
  text: { primary: '#ffffff', secondary: '#cfd8dc', disabled: '#78909c' },
};

// Theme builder function
export const useTheme = (mode: 'light' | 'dark') => {
  const selectedTab = useAtomValue(selectedTabAtom);
  const tab = TABS[selectedTab];

  const basePalette = mode === 'light' ? lightPalette : darkPalette;

  const dynamicPalette = {
    ...basePalette,
    primary: basePalette[tab as keyof typeof basePalette] || basePalette.primary,
  };

  return createTheme(deepmerge(baseTheme, { palette: dynamicPalette }));
};
