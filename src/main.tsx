// This file serves as the entry point for the React application.
// It configures the dayjs library with UTC and timezone plugins, setting the
// default timezone to America/Toronto.
// It initializes the React root, wraps the application with essential providers
// including React Query for data fetching,
// Material-UI's LocalizationProvider for date handling, and a custom
// LightDarkProvider for theme management.
// Additionally, it renders global dialog components (EntryDialog and
// DeleteDialog) alongside the main App component,
// ensuring a consistent and functional UI across the application.

// eslint-disable-next-line import/order
import dayjs from 'dayjs';
// eslint-disable-next-line import/order
import utc from 'dayjs/plugin/utc';
// eslint-disable-next-line import/order
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Toronto');

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './index.css';
import App from './App';

import { LightDarkProvider } from './contexts/LightDarkContext';
import DeleteDialog from './dialogs/DeleteDialog';
import EntryDialog from './dialogs/EntryDialog';

const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <LightDarkProvider>
          <App />

          <EntryDialog />
          <DeleteDialog />
        </LightDarkProvider>
      </LocalizationProvider>
    </QueryClientProvider>
  </StrictMode>,
);
