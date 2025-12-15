import React from 'react';
import GoogleIcon from '@mui/icons-material/Google';
import { Alert, Button, Box, Paper, Typography, Stack } from '@mui/material';

import useGoogleAPI from '../../hooks/useGoogleAPI';

function LoginPage() {
  const { signIn } = useGoogleAPI();

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: '100%',
          maxWidth: 420,
          borderRadius: 3,
          textAlign: 'center',
        }}
      >
        <Stack spacing={2}>
          <Typography variant="h5" fontWeight={600}>
            Welcome to Baby B
          </Typography>

          <Alert severity="info">
            Please sign in with Google Drive to continue.
          </Alert>

          <Button
            variant="contained"
            size="large"
            startIcon={<GoogleIcon />}
            onClick={signIn}
            sx={{
              py: 1,
              textTransform: 'none',
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            Sign in with Google
          </Button>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1, px: 1, lineHeight: 1 }}
          >
            Baby B stores your baby’s data securely in <strong>your</strong>{' '}
            Google Drive. It is completely owned and controlled only by{' '}
            <strong>you</strong>.
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
}

export default React.memo(LoginPage);
