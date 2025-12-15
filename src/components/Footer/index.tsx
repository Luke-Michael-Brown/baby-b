import { memo } from 'react';
import AddIcon from '@mui/icons-material/Add';
import {
  Box,
  Stack,
  Typography,
  useTheme,
  type PaletteColor,
} from '@mui/material';

import ThemedAppBar from '../ThemedAppBar';
import EntryAdderButtons from '../EntryAdderButtons';

function Footer() {
  const theme = useTheme();

  // Try to get a known palette color safely
  const paletteColor: PaletteColor =
    (theme.palette.primary as PaletteColor) || theme.palette.primary;

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Floating Add Entry Tag aligned left */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 56, // height of AppBar or adjust slightly
          left: 0,
          color: paletteColor.contrastText,
          bgcolor: 'primary.main',
          px: 1,
          py: 1,
          borderTopRightRadius: '6px',
          borderBottomRightRadius: '6px',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <AddIcon sx={{ fontSize: 18, mr: 0.5 }} />
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
          Add Entry
        </Typography>
      </Box>

      <ThemedAppBar
        position="fixed"
        color="primary"
        sx={{ top: 'auto', bottom: 0 }}
      >
        <Stack
          sx={{ px: 2, pt: 1, pb: 2, justifyContent: 'center' }}
          spacing={2}
        >
          <EntryAdderButtons />
        </Stack>
      </ThemedAppBar>
    </Box>
  );
}

export default memo(Footer);
