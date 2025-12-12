import React from 'react'
import { Box, Stack, Typography, Button } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import { TABS } from '../../atoms/selectedTabAtom'
import { useEntryDialog } from '../../dialogs/EntryDialog'
import ThemedAppBar from '../ThemedAppBar'

function Footer() {
  const { openEntryDialog } = useEntryDialog()

  const onAddButtonClicked = (tab: string) => {
    openEntryDialog({ tab })
  }

  // --- GRID LOGIC ---
  const items = TABS.slice(1)
  const count = items.length

  const chooseBestCols = (count: number) => {
    let best = { cols: 1, rows: count, score: Infinity }

    for (let cols = 1; cols <= 4; cols++) {
      const rows = Math.ceil(count / cols)
      const fullInLastRow = count % cols === 0 ? cols : count % cols
      const balancePenalty = (cols - fullInLastRow) / cols
      const score = rows + balancePenalty

      if (score < best.score) {
        best = { cols, rows, score }
      }
    }
    return best.cols
  }

  const cols = chooseBestCols(count)

  return (
    <Box sx={{ flexGrow: 1 }}>
      <ThemedAppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0 }}>
        <Stack sx={{ px: 2, py: 1, justifyContent: 'center' }} spacing={2} direction="row">
          <Stack sx={{ alignItems: 'center' }} direction="row">
            <AddIcon />
            <Typography variant="body1">Add Entry</Typography>
          </Stack>

          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              width: '100%',
              maxWidth: 500,
            }}
          >
            {items.map((tab, index) => {
              const row = Math.floor(index / cols)
              const col = index % cols

              const totalRows = Math.ceil(count / cols)

              const isTop = row === 0
              const isBottom = row === totalRows - 1
              const isLeft = col === 0
              const isRight = col === cols - 1 || index === count - 1

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
                      borderTop: isTop ? '1px solid rgba(255,255,255,0.4)' : '0',
                      borderLeft: isLeft ? '1px solid rgba(255,255,255,0.4)' : '0',
                      borderRight: isRight
                        ? '1px solid rgba(255,255,255,0.4)'
                        : '1px solid rgba(255,255,255,0.4)',
                      borderBottom: isBottom
                        ? '1px solid rgba(255,255,255,0.4)'
                        : '1px solid rgba(255,255,255,0.4)',
                      borderRadius: 0,
                      ...(isTop && isLeft && { borderTopLeftRadius: '6px' }),
                      ...(isTop && isRight && { borderTopRightRadius: '6px' }),
                      ...(isBottom && isLeft && { borderBottomLeftRadius: '6px' }),
                      ...(isBottom && isRight && { borderBottomRightRadius: '6px' }),
                    }}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </Button>
                </Box>
              )
            })}
          </Box>
        </Stack>
      </ThemedAppBar>
    </Box>
  )
}
export default React.memo(Footer)
