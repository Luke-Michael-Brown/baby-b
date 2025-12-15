import { memo } from 'react';
import LogoutIcon from '@mui/icons-material/Logout';
import { Tooltip, IconButton } from '@mui/material';

import useCurrentPage from '../../hooks/useCurrentPage';
import useGoogleAPI from '../../hooks/useGoogleAPI';

function LogoutButton() {
  const currentPage = useCurrentPage();
  const { signOut } = useGoogleAPI();

  if (currentPage !== 'content') {
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
