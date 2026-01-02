// React component for ToggleThemeButton
import { memo, useCallback } from 'react';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { Tooltip, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { useLightDark } from '../../contexts/LightDarkContext';

function ToggleThemeButton() {
  const theme = useTheme();
  const mode = theme?.palette?.mode ?? 'light';
  const { setMode } = useLightDark();
  const onToggleMode = useCallback(() => {
    setMode(mode === 'light' ? 'dark' : 'light');
  }, [setMode, mode]);

  return (
    <Tooltip title="Toggle theme">
      <IconButton onClick={onToggleMode}>
        {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
    </Tooltip>
  );
}

export default memo(ToggleThemeButton);
