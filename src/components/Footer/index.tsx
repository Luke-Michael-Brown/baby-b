import React from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import AddIcon from '@mui/icons-material/Add'
import ThemedAppBar from '../ThemedAppBar'
import { TABS } from '../../atoms/selectedTabAtom'
import { useEntryDialog } from '../../dialogs/EntryDialog'

function Footer() {
  const { openEntryDialog } = useEntryDialog()

  const onAddButtonClicked = (tab: string) => {
    openEntryDialog({ tab })
  }

  // --- GRID LOGIC ---
  const items = TABS.slice(1)
  const count = items.length
  const cols = Math.min(4, Math.ceil(Math.sqrt(count)))

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
                <Box
                  key={tab}
                  sx={{
                    width: `${100 / cols}%`,
                  }}
                >
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
                      ...(isTop &&
                        isLeft && {
                          borderTopLeftRadius: '6px',
                        }),
                      ...(isTop &&
                        isRight && {
                          borderTopRightRadius: '6px',
                        }),
                      ...(isBottom &&
                        isLeft && {
                          borderBottomLeftRadius: '6px',
                        }),
                      ...(isBottom &&
                        isRight && {
                          borderBottomRightRadius: '6px',
                        }),
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
