import { memo } from 'react';
import { Box, CircularProgress } from '@mui/material';
import ChildCareIcon from '@mui/icons-material/ChildCare';

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
      {/* Overlay container */}
      <Box
        sx={{
          position: 'relative',
          width: 72,
          height: 72,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress size={72} />
        <ChildCareIcon
          sx={{
            position: 'absolute',
            fontSize: '3em',
          }}
        />
      </Box>
    </Box>
  );
}

export default memo(LoadingSceen);
