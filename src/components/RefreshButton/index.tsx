import { memo } from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Tooltip, Box, IconButton } from '@mui/material';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';

import useGoogleAPI from '../../hooks/useGoogleAPI';

function RefreshButton() {
  const { isSignedIn } = useGoogleAPI();
  const qc = useQueryClient();

  const isRefreshing =
    useIsFetching({
      queryKey: ['babies-data'],
    }) > 0;

  const refreshData = async () => {
    await qc.invalidateQueries({
      queryKey: ['babies-data'],
      exact: true,
    });
  };

  if (!isSignedIn) {
    return null;
  }

  return (
    <Tooltip title="Refresh data">
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <IconButton onClick={refreshData} disabled={isRefreshing}>
          <RefreshIcon
            sx={{
              ...(isRefreshing && {
                animation: 'spin 1s linear infinite',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
              }),
            }}
          />
        </IconButton>
      </Box>
    </Tooltip>
  );
}

export default memo(RefreshButton);
