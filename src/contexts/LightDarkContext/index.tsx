/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';

import { useTheme } from '../../theme';

type Mode = 'light' | 'dark';

interface LightDarkContextType {
  mode: Mode;
  setMode: (newMode: Mode) => void;
}

const LightDarkContext = createContext<LightDarkContextType>({
  mode: 'light' as Mode,
  setMode: () => {},
});

export function LightDarkProvider({ children }: { children: ReactNode }) {
  const [mode, _setMode] = useState<Mode>(
    localStorage.getItem('mode') === 'dark' ? 'dark' : 'light',
  );
  const setMode = (newMode: Mode) => {
    _setMode(newMode);
    localStorage.setItem('mode', newMode);
  };

  const theme = useTheme(mode);
  const value = useMemo(() => ({ mode, setMode }), [mode]);

  return (
    <LightDarkContext.Provider value={value}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </LightDarkContext.Provider>
  );
}

export function useLightDark() {
  const context = useContext(LightDarkContext);
  if (context === undefined) {
    throw new Error('useLightDark must be used within a LightDarkProvider');
  }

  return context;
}
