// React component for TabSelector
import { memo } from 'react';
import { useAtom } from 'jotai';
import { Box, Typography, Select, MenuItem } from '@mui/material';

import type { SelectChangeEvent } from '@mui/material';
import selectedTabAtom, { TABS } from '../../atoms/selectedTabAtom';
import config from '../../config';

function TabSelector() {
  const [{ tab }, setSelectedTab] = useAtom(selectedTabAtom);

  const onTabSelected = (event: SelectChangeEvent<string>) => {
    setSelectedTab(event.target.value);
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <Typography variant="body1">Tab:</Typography>
      <Select
        value={tab || ''}
        onChange={onTabSelected}
        size="small"
        renderValue={value => value} // only show the text, no icon
      >
        {TABS.map(t => {
          const Icon = config[t].Icon;
          return (
            <MenuItem
              key={t}
              value={t}
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              <Icon sx={{ fontSize: '1em' }} includeBorder={true} />
              {t}
            </MenuItem>
          );
        })}
      </Select>
    </Box>
  );
}

export default memo(TabSelector);
