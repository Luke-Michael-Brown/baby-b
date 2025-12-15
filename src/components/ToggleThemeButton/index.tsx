import { memo } from 'react';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { Tooltip, IconButton } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { useLightDark } from '../../contexts/LightDarkContext';

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

export default memo(ToggleThemeButton);
