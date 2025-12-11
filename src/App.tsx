import { useState, useEffect } from 'react'
import { useAtom } from 'jotai'
import { ThemeProvider, CssBaseline, Alert, Button, CircularProgress } from '@mui/material'
import Header from './components/Header'
import TabBar from './components/TabBar'
import TabContent from './components/TabContent'
import Footer from './components/Footer'
import Box from '@mui/material/Box'
import { useTheme } from './theme'
import useGoogleAPI, { useGoogleAPISetup } from './hooks/useGoogleAPI'
import useBabiesList from './hooks/useBabiesList'
import selectedBabyAtom from './atoms/selectedBabyAtom'
import EntryDialog from './dialogs/EntryDialog'
import DeleteDialog from './dialogs/DeleteDialog'

interface Props {
  setMode: (newMode: 'light' | 'dark') => void
}

function App({ setMode }: Props) {
  const { data: babiesList, isLoading } = useBabiesList()
  const [selectedBaby, setSelectedBaby] = useAtom(selectedBabyAtom)
  useEffect(() => {
    if (selectedBaby === null && !isLoading && babiesList && babiesList.length > 0) {
      setSelectedBaby(babiesList[0])
    }
  }, [selectedBaby, babiesList, isLoading, setSelectedBaby])

  return isLoading || !selectedBaby ? (
    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress />
    </Box>
  ) : (
    <>
      <Header setMode={setMode} />
      <TabBar />
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
      <Footer />
      <EntryDialog />
      <DeleteDialog />
    </>
  )
}

function AppContainer() {
  useGoogleAPISetup()

  const [mode, _setMode] = useState<'light' | 'dark'>(
    localStorage.getItem('mode') === 'dark' ? 'dark' : 'light'
  )
  const setMode = (newMode: 'light' | 'dark') => {
    _setMode(newMode)
    localStorage.setItem('mode', newMode)
  }
  const theme = useTheme(mode)
  const { isSignedIn, signIn } = useGoogleAPI()

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
        {isSignedIn ? (
          <App setMode={setMode} />
        ) : (
          <>
            <Alert severity="info" sx={{ mb: 2 }}>
              Please sign in with Google Drive to use Baby B.
            </Alert>
            <Button variant="contained" onClick={signIn}>
              Sign in
            </Button>
          </>
        )}
      </Box>
    </ThemeProvider>
  )
}

export default AppContainer
