import React from 'react';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';

import BabySelector from '../BabySelector';
import TabSelector from '../TabSelector';

export function SecondaryBar() {
  const theme = useTheme();

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
      <TabSelector />
    </Box>
  );
}

export default React.memo(SecondaryBar);
