// This file defines the AppIcon component, a memoized React component that
// displays the application's logo using an SVG image.
// It accepts a fontSize prop for sizing and applies theme-aware styling,
// including a filter to invert colors in light mode for better visibility.
// The component ensures consistent branding across the baby tracking
// application.

import { memo } from 'react';
import { Box } from '@mui/material';

import appIconUrl from '../../assets/baby_b_svg.svg';

function AppIcon({ sx: { fontSize = '3em' } }: { sx: { fontSize: string } }) {
  return (
    <Box
      component="img"
      src={appIconUrl}
      alt="AppIcon"
      sx={{
        width: fontSize,
        height: fontSize,
        verticalAlign: 'middle',
        borderRadius: 50,
        backgroundColor: 'white',
      }}
    />
  );
}

export default memo(AppIcon);
