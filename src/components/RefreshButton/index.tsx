import { memo, useEffect, useState } from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Tooltip, Box, IconButton } from '@mui/material';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';

import useGoogleAPI from '../../hooks/useGoogleAPI';

const SPIN_DURATION_MS = 1000;

function RefreshButton() {
  const { isSignedIn } = useGoogleAPI();
  const qc = useQueryClient();

  const isRefreshing =
    useIsFetching({
      queryKey: ['babies-data'],
    }) > 0;

  const [shouldSpin, setShouldSpin] = useState(false);

  useEffect(() => {
    if (isRefreshing) {
      // Start spinning immediately
      setShouldSpin(true);
      return;
    }

    // Finish the current rotation before stopping
    if (shouldSpin) {
      const timeout = setTimeout(() => {
        setShouldSpin(false);
      }, SPIN_DURATION_MS);

      return () => clearTimeout(timeout);
    }
  }, [isRefreshing, shouldSpin]);

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
              ...(shouldSpin && {
                animation: 'spin 1s linear infinite',
              }),
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              },
            }}
          />
        </IconButton>
      </Box>
    </Tooltip>
  );
}

export default memo(RefreshButton);
