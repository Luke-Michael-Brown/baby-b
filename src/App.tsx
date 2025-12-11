import { useState, useEffect } from 'react'
import { useAtom } from 'jotai'
import { ThemeProvider, CssBaseline, CircularProgress } from '@mui/material'
import Header from './components/Header'
import SecondaryBar from './components/SecondaryBar'
import TabContent from './components/TabContent'
import Footer from './components/Footer'
import Box from '@mui/material/Box'
import { useTheme } from './theme'
import useGoogleAPI, { useGoogleAPISetup } from './hooks/useGoogleAPI'
import useBabiesList from './hooks/useBabiesList'
import selectedBabyAtom from './atoms/selectedBabyAtom'
import EntryDialog from './dialogs/EntryDialog'
import DeleteDialog from './dialogs/DeleteDialog'
import LoginPage from './components/LoginPage'

export default function App() {
  useGoogleAPISetup()

  const [mode, _setMode] = useState<'light' | 'dark'>(
    localStorage.getItem('mode') === 'dark' ? 'dark' : 'light'
  )
  const setMode = (newMode: 'light' | 'dark') => {
    _setMode(newMode)
    localStorage.setItem('mode', newMode)
  }
  const theme = useTheme(mode)

  const { isSignedIn } = useGoogleAPI()
  const { data: babiesList, isLoading } = useBabiesList()
  const [selectedBaby, setSelectedBaby] = useAtom(selectedBabyAtom)
  useEffect(() => {
    if (selectedBaby === null && !isLoading && babiesList && babiesList.length > 0) {
      setSelectedBaby(babiesList[0])
    }
  }, [selectedBaby, babiesList, isLoading, setSelectedBaby])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          height: '100vh',
          width: '100%',
        }}
      >
        <Header setMode={setMode} />
        {!isLoading ? <SecondaryBar /> : null}
        {isSignedIn ? (
          isLoading || !selectedBaby ? (
            <Box
              sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <CircularProgress />
            </Box>
          ) : (
            <Box
              sx={{
                flexGrow: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                pb: '98px',
              }}
            >
              <TabContent />
            </Box>
          )
        ) : (
          <LoginPage />
        )}
        {!isLoading ? <Footer /> : null}
        <EntryDialog />
        <DeleteDialog />
      </Box>
    </ThemeProvider>
  )
}
