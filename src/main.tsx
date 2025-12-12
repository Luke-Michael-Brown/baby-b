import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import './index.css'
import App from './App'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import { LightDarkProvider } from './contexts/LightDarkContext'
import DeleteDialog from './dialogs/DeleteDialog'
import EntryDialog from './dialogs/EntryDialog'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('America/Toronto')

const queryClient = new QueryClient()

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
  </StrictMode>
)
