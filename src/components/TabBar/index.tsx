import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import { useAtom } from 'jotai';
import selectedTabAtom, { TABS } from '../../atoms/selectedTabAtom';

export default function BasicTabs() {
  const theme = useTheme();
  const [selectedTab, setSelectedTab] = useAtom(selectedTabAtom);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

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
        >
          {TABS.map((tab) => (
            <Tab
              key={tab}
              label={tab}
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
  );
}
