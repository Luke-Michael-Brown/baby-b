import { useAtom } from 'jotai'
import React from 'react'
import type { SelectChangeEvent } from '@mui/material'
import { Box, Typography, Select, MenuItem } from '@mui/material'
import selectedTabAtom, { TABS } from '../../atoms/selectedTabAtom'
import config from '../../config'

function TabSelector() {
  const [{ tab }, setSelectedTab] = useAtom(selectedTabAtom)

  const onTabSelected = (event: SelectChangeEvent<string>) => {
    setSelectedTab(event.target.value)
  }

  return (
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
  )
}

export default React.memo(TabSelector)
