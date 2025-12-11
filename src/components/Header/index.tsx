import { useAtomValue } from 'jotai'
import { useQueryClient } from '@tanstack/react-query'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import RefreshIcon from '@mui/icons-material/Refresh'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import LogoutIcon from '@mui/icons-material/Logout'
import { useState } from 'react'

import packageJson from '../../../package.json'
import useGoogleAPI from '../../hooks/useGoogleAPI'
import { useTheme } from '@mui/material/styles'
import ThemedAppBar from '../ThemedAppBar'
import selectedTabAtom from '../../atoms/selectedTabAtom'

interface Props {
  setMode: (newMode: 'light' | 'dark') => void
}

function Header({ setMode }: Props) {
  const { signOut } = useGoogleAPI()
  const theme = useTheme()
  const mode = theme?.palette?.mode ?? 'light'

  const onToggleMode = () => {
    setMode(mode === 'light' ? 'dark' : 'light')
  }

  const { Icon } = useAtomValue(selectedTabAtom)

  const qc = useQueryClient()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const refreshData = async () => {
    setIsRefreshing(true)
    try {
      await qc.invalidateQueries({
        queryKey: ['babies-data'],
        exact: true,
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <Box>
      <ThemedAppBar color="primary" position="static">
        <Stack sx={{ px: 2, py: 1 }} direction="row" alignItems="center">
          <Stack spacing={1} direction="row" alignItems="center">
            <Icon sx={{ fontSize: '3em' }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Baby B
            </Typography>
            <Typography variant="body2" component="div" sx={{ flexGrow: 1, opacity: 0.7 }}>
              {`v${packageJson.version}`}
            </Typography>
          </Stack>

          <Stack sx={{ ml: 'auto' }} direction="row" spacing={1} alignItems="center">
            <Tooltip title="Toggle theme">
              <IconButton onClick={onToggleMode}>
                {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Refresh data">
              <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                <IconButton onClick={refreshData} disabled={isRefreshing}>
                  <RefreshIcon
                    sx={{
                      ...(isRefreshing && {
                        animation: 'spin 1s linear infinite',
                        '@keyframes spin': {
                          '0%': { transform: 'rotate(0deg)' },
                          '100%': { transform: 'rotate(360deg)' },
                        },
                      }),
                    }}
                  />
                </IconButton>
              </Box>
            </Tooltip>

            <Tooltip title="Sign out">
              <IconButton onClick={signOut}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </ThemedAppBar>
    </Box>
  )
}

export default Header
