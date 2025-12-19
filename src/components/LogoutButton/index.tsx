// React component for LogoutButton
import { memo } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import { Tooltip, IconButton } from '@mui/material';

import useGoogleAPI from '../../hooks/useGoogleAPI';

function LogoutButton() {
  const { isSignedIn, signOut } = useGoogleAPI();

  if (!isSignedIn) {
    return null;
  }

  return (
    <Tooltip title="Loug out">
      <IconButton onClick={signOut}>
        <LogoutIcon />
      </IconButton>
    </Tooltip>
  );
}

export default memo(LogoutButton);
