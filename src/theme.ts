import { createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';
import { deepmerge } from '@mui/utils';

declare module '@mui/material/styles' {
  interface Palette {
    neutral: Palette['primary'];
  }
  interface PaletteOptions {
    neutral?: PaletteOptions['primary'];
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

// Light mode palette
const lightPalette: ThemeOptions['palette'] = {
  mode: 'light',
  primary: { main: '#1976d2' },
  secondary: { main: '#9c27b0' },
  neutral: { main: '#64748B', contrastText: '#fff' },
  background: { default: '#f5f5f5', paper: '#ffffff' },
  divider: '#e0e0e0',
};

// Dark mode palette
const darkPalette: ThemeOptions['palette'] = {
  mode: 'dark',
  primary: { main: '#90caf9' },
  secondary: { main: '#ce93d8' },
  neutral: { main: '#94a3b8', contrastText: '#000' },
  background: { default: '#121212', paper: '#1e1e1e' },
  divider: 'rgba(255,255,255,0.12)',
};

// Theme builder function
export const getTheme = (mode: 'light' | 'dark') =>
  createTheme(deepmerge(baseTheme, {
    palette: mode === 'light' ? lightPalette : darkPalette,
  }));
