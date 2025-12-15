import React from 'react';
import { Box } from '@mui/material';

import appIconUrl from '../../assets/baby_b_svg.svg';

function AppIcon() {
  return (
    <Box
      component="img"
      src={appIconUrl}
      alt="AppIcon"
      sx={theme => ({
        width: '3em',
        height: '3em',
        verticalAlign: 'middle',
        filter:
          theme.palette.mode === 'light' ? 'invert(1) brightness(1.2)' : 'none',
      })}
    />
  );
}

export default React.memo(AppIcon);
