import React from 'react';
import { useTheme } from '@mui/material/styles';
import { Tooltip, IconButton } from '@mui/material';
import { useLightDark } from '../../contexts/LightDarkContext';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';

function ToggleThemeButton() {
  const theme = useTheme();
  const mode = theme?.palette?.mode ?? 'light';
  const { setMode } = useLightDark();
  const onToggleMode = () => {
    setMode(mode === 'light' ? 'dark' : 'light');
  };

  return (
    <Tooltip title="Toggle theme">
      <IconButton onClick={onToggleMode}>
        {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
      </IconButton>
    </Tooltip>
  );
}

export default React.memo(ToggleThemeButton);
