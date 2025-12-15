import { memo } from 'react';
import { Box, CircularProgress } from '@mui/material';

function LoadingSceen() {
  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <CircularProgress />
    </Box>
  );
}

export default memo(LoadingSceen);
