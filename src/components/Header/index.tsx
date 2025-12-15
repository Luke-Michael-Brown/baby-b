import React from 'react'
import { useAtom } from 'jotai'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import packageJson from '../../../package.json'
import ThemedAppBar from '../ThemedAppBar'
import selectedTabAtom from '../../atoms/selectedTabAtom'
import RefreshButton from '../RefreshButton'
import LogoutButton from '../LogoutButton'
import ToggleThemeButton from '../ToggleThemeButton'

function Header() {
  const [
    {
      tabConfig: { Icon },
    },
    setSelectedTab,
  ] = useAtom(selectedTabAtom)

  const onTitleClick = () => {
    setSelectedTab('summary')
  }

  return (
    <Box>
      <ThemedAppBar color="primary" position="static">
        <Stack sx={{ px: 2, py: 1 }} direction="row" alignItems="center">
          <Stack
            spacing={1}
            direction="row"
            alignItems="center"
            onClick={onTitleClick}
            sx={{ cursor: 'pointer' }}
          >
            <Icon sx={{ fontSize: '3em' }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Baby B
            </Typography>
            <Typography variant="body2" component="div" sx={{ flexGrow: 1, opacity: 0.7 }}>
              {`v${packageJson.version}`}
            </Typography>
          </Stack>

          <Stack sx={{ ml: 'auto' }} direction="row" spacing={1} alignItems="center">
            <RefreshButton />
            <LogoutButton />
            <ToggleThemeButton />
          </Stack>
        </Stack>
      </ThemedAppBar>
    </Box>
  )
}

export default React.memo(Header)
