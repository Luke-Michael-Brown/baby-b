import { memo } from 'react';
import { Box } from '@mui/material';

import appIconUrl from '../../assets/baby_b_svg.svg';

function AppIcon({ sx: { fontSize = '3em' } }: { sx: { fontSize: string } }) {
  return (
    <Box
      component="img"
      src={appIconUrl}
      alt="AppIcon"
      sx={theme => ({
        width: fontSize,
        height: fontSize,
        verticalAlign: 'middle',
        borderRadius: 50,
        filter:
          theme.palette.mode === 'light' ? 'invert(1) brightness(1.2)' : 'none',
      })}
    />
  );
}

export default memo(AppIcon);
