import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import { useAtom } from 'jotai'
import selectedTabAtom, { TABS } from '../../atoms/selectedTabAtom'
import { Select, MenuItem, type SelectChangeEvent, Typography } from '@mui/material'
import BabySelector from '../BabySelector'

export default function SecondaryBar() {
  const theme = useTheme()
  const [{ tab }, setSelectedTab] = useAtom(selectedTabAtom)

  const onTabSelected = (event: SelectChangeEvent<string>) => {
    setSelectedTab(event.target.value)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          bgcolor: theme.palette.background.paper,
          px: 2,
          py: 1,
          gap: 2,
          display: 'flex',
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'divider',
        }}
      >
        <BabySelector />
        <Box sx={{ flexDirection: 'row', display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="body1" component="div" sx={{ flexGrow: 1 }}>
            Tab:
          </Typography>
          <Select value={tab || ''} label="Tab" onChange={onTabSelected} size="small">
            {TABS.map(t => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </Select>
        </Box>
      </Box>
    </Box>
  )
}
