import React from 'react';
import { Box, Toolbar, useTheme } from '@mui/material';

interface ThemedAppBarProps {
  position?: 'fixed' | 'absolute' | 'sticky' | 'static' | 'relative';
  color?:
    | 'primary'
    | 'secondary'
    | 'neutral'
    | 'blue'
    | 'purple'
    | 'green'
    | 'yellow'
    | 'red'
    | 'orange';
  sx?: any;
  children?: React.ReactNode;
}

/**
 * A theme-aware AppBar replacement that supports custom palette colors
 * and all standard AppBar positioning & styling props.
 *
 * Usage:
 *  <ThemedAppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
 *  <ThemedAppBar color="purple" position="static">
 */
export default function ThemedAppBar({
  position = 'static',
  color = 'primary',
  sx,
  children,
}: ThemedAppBarProps) {
  const theme = useTheme();
  const paletteColor = theme.palette[color] || theme.palette.primary;

  return (
    <Box
      component="header"
      sx={{
        position,
        top: position === 'fixed' || position === 'absolute' ? 0 : undefined,
        left: 0,
        right: 0,
        zIndex: theme.zIndex.appBar,
        bgcolor: paletteColor.main,
        color: paletteColor.contrastText,
        boxShadow: theme.shadows[4],
        transition: 'background-color 0.3s ease, color 0.3s ease',
        ...sx, // allow full overrides like AppBar
      }}
    >
      {children}
    </Box>
  );
}
