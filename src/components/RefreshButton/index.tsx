import { memo, useState, useEffect, useRef, useCallback } from 'react';
import RefreshIcon from '@mui/icons-material/Refresh';
import { Tooltip, Box, IconButton } from '@mui/material';
import { useIsFetching, useQueryClient } from '@tanstack/react-query';
import useGoogleAPI from '../../hooks/useGoogleAPI';

const SPIN_DURATION = 1000; // 1 second per rotation

function RefreshButton() {
  const { isSignedIn } = useGoogleAPI();
  const qc = useQueryClient();

  const isFetching = useIsFetching({ queryKey: ['babies-data'] }) > 0;
  const [isSpinning, setIsSpinning] = useState(false);

  // Track when the animation started
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    let timeout = null;
    if (isFetching) {
      // If not already spinning, start the clock
      if (!isSpinning) {
        setIsSpinning(true);
        startTimeRef.current = Date.now();
      }
    } else if (isSpinning && startTimeRef.current) {
      // Data finished. Calculate how far into the current 1s cycle we are.
      const elapsed = Date.now() - startTimeRef.current;
      const remainder = SPIN_DURATION - (elapsed % SPIN_DURATION);

      timeout = setTimeout(() => {
        setIsSpinning(false);
        startTimeRef.current = null;
      }, remainder);
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [isFetching, isSpinning]);

  const refreshData = useCallback(async () => {
    // Only trigger if not already busy
    if (!isSpinning) {
      await qc.invalidateQueries({
        queryKey: ['babies-data'],
        exact: true,
      });
    }
  }, [isSpinning]);

  if (!isSignedIn) return null;

  return (
    <Tooltip title="Refresh data">
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <IconButton onClick={refreshData} disabled={isSpinning}>
          <RefreshIcon
            sx={{
              ...(isSpinning && {
                animation: `spin ${SPIN_DURATION}ms linear infinite`,
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
