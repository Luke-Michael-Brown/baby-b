import React from 'react'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import { useAtom } from 'jotai'
import selectedTabAtom, { TABS } from '../../atoms/selectedTabAtom'
import { Select, MenuItem, type SelectChangeEvent, Typography } from '@mui/material'
import BabySelector from '../BabySelector'
import config from '../../config'

export function SecondaryBar() {
  const theme = useTheme()
  const [{ tab }, setSelectedTab] = useAtom(selectedTabAtom)

  const onTabSelected = (event: SelectChangeEvent<string>) => {
    setSelectedTab(event.target.value)
  }

  return (
    <Box
      sx={{
        bgcolor: theme.palette.background.paper,
        px: 2,
        py: 1,
        display: 'flex',
        borderBottom: 1,
        borderColor: 'divider',
        alignItems: 'center',
      }}
    >
      <BabySelector />

      <Box sx={{ flexGrow: 1 }} />

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="body1">Tab:</Typography>
        <Select value={tab || ''} label="Tab" onChange={onTabSelected} size="small">
          {TABS.filter(tab => config[tab].TabComponent).map(t => (
            <MenuItem key={t} value={t}>
              {t}
            </MenuItem>
          ))}
        </Select>
      </Box>
    </Box>
  )
}

export default React.memo(SecondaryBar)
