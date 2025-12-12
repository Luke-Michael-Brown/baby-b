import { useState, useEffect } from 'react'
import { useAtom } from 'jotai'
import { ThemeProvider, CssBaseline } from '@mui/material'
import Header from './components/Header'
import Box from '@mui/material/Box'
import { useTheme } from './theme'
import useGoogleAPI, { useGoogleAPISetup } from './hooks/useGoogleAPI'
import useBabiesList from './hooks/useBabiesList'
import selectedBabyAtom from './atoms/selectedBabyAtom'
import EntryDialog from './dialogs/EntryDialog'
import DeleteDialog from './dialogs/DeleteDialog'
import LoginPage from './pages/LoginPage'
import LoadingPage from './pages/LoadingPage'
import ContentPage from './pages/ContentPage'

export default function App() {
  useGoogleAPISetup()
  const { isSignedIn } = useGoogleAPI()
  const { data: babiesList, isLoading } = useBabiesList()
  const [selectedBaby, setSelectedBaby] = useAtom(selectedBabyAtom)

  const [mode, _setMode] = useState<'light' | 'dark'>(
    localStorage.getItem('mode') === 'dark' ? 'dark' : 'light'
  )
  const setMode = (newMode: 'light' | 'dark') => {
    _setMode(newMode)
    localStorage.setItem('mode', newMode)
  }
  const theme = useTheme(mode)

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
        {isSignedIn ? (
          isLoading || !selectedBaby ? (
            <LoadingPage />
          ) : (
            <ContentPage />
          )
        ) : (
          <LoginPage />
        )}
        <EntryDialog />
        <DeleteDialog />
      </Box>
    </ThemeProvider>
  )
}
