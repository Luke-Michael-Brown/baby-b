import * as React from 'react'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
import { useAtom } from 'jotai'
import selectedTabAtom, { TABS } from '../../atoms/selectedTabAtom'

export default function BasicTabs() {
  const theme = useTheme()
  const [selectedTab, setSelectedTab] = useAtom(selectedTabAtom)

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box
        sx={{
          borderBottom: 1,
          borderColor: 'divider',
          bgcolor: theme.palette.background.paper,
        }}
      >
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          textColor="primary"
          indicatorColor="primary"
          variant="scrollable" // keeps tabs from squishing too much
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              fontSize: '0.8rem', // smaller font size
              minWidth: '4rem', // narrower tab width
              padding: '0.3rem 0.5rem', // compact padding
              textTransform: 'none', // optional: keeps label case
            },
          }}
        >
          {TABS.map(tab => (
            <Tab
              key={tab}
              label={tab.charAt(0).toUpperCase() + tab.slice(1)}
              sx={{
                color: theme.palette.text.primary,
                '&.Mui-selected': {
                  color: theme.palette.primary.main,
                },
              }}
            />
          ))}
        </Tabs>
      </Box>
    </Box>
  )
}
