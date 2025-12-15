import { memo } from 'react';
import AddIcon from '@mui/icons-material/Add';
import {
  Box,
  Stack,
  Typography,
  Button,
  useTheme,
  type PaletteColor,
} from '@mui/material';

import { TABS } from '../../atoms/selectedTabAtom';
import config from '../../config';
import { useEntryDialog } from '../../dialogs/EntryDialog';
import DataTab from '../../tabs/DataTab';
import ThemedAppBar from '../ThemedAppBar';

function Footer() {
  const { openEntryDialog } = useEntryDialog();

  const onAddButtonClicked = (tab: string) => {
    openEntryDialog({ tab });
  };

  // --- GRID LOGIC ---
  const items = TABS.filter(tab => config[tab].TabComponent === DataTab);
  const count = items.length;

  const chooseBestCols = (count: number) => {
    let best = { cols: 1, rows: count, score: Infinity };
    for (let cols = 1; cols <= 5; cols++) {
      const rows = Math.ceil(count / cols);
      const fullInLastRow = count % cols === 0 ? cols : count % cols;
      const balancePenalty = (cols - fullInLastRow) / cols;
      const score = rows + balancePenalty;
      if (score < best.score) {
        best = { cols, rows, score };
      }
    }
    return best.cols;
  };

  const cols = chooseBestCols(count);

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
          {/* Grid Buttons */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              width: '100%',
              maxWidth: 500,
              mx: 'auto',
            }}
          >
            {items.map((tab, index) => {
              const row = Math.floor(index / cols);
              const col = index % cols;
              const totalRows = Math.ceil(count / cols);

              const isTop = row === 0;
              const isBottom = row === totalRows - 1;
              const isLeft = col === 0;
              const isRight = col === cols - 1 || index === count - 1;

              return (
                <Box key={tab} sx={{ width: `${100 / cols}%` }}>
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="medium"
                    onClick={() => onAddButtonClicked(tab)}
                    sx={{
                      border: '1px solid rgba(255,255,255,0.4)',
                      borderTop: isTop
                        ? '1px solid rgba(255,255,255,0.4)'
                        : '0',
                      borderLeft: isLeft
                        ? '1px solid rgba(255,255,255,0.4)'
                        : '0',
                      borderRight: isRight
                        ? '1px solid rgba(255,255,255,0.4)'
                        : '1px solid rgba(255,255,255,0.4)',
                      borderBottom: isBottom
                        ? '1px solid rgba(255,255,255,0.4)'
                        : '1px solid rgba(255,255,255,0.4)',
                      borderRadius: 0,
                      ...(isTop && isLeft && { borderTopLeftRadius: '6px' }),
                      ...(isTop && isRight && { borderTopRightRadius: '6px' }),
                      ...(isBottom &&
                        isLeft && { borderBottomLeftRadius: '6px' }),
                      ...(isBottom &&
                        isRight && { borderBottomRightRadius: '6px' }),
                    }}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </Button>
                </Box>
              );
            })}
          </Box>
        </Stack>
      </ThemedAppBar>
    </Box>
  );
}

export default memo(Footer);
