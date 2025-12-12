import React from 'react'
import Paper from '@mui/material/Paper'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import { TABS_TO_ICON } from '../../atoms/selectedTabAtom'
import useTabSummary from '../../hooks/useTabSummary'

interface Props {
  tab: string
}

function SummaryItem({ tab }: Props) {
  const Icon = TABS_TO_ICON[tab]
  const summaries = useTabSummary({ tab })

  return (
    <Paper
      sx={{
        px: 1,
        py: 1,
        bgcolor: `${tab}.main`,
        color: `${tab}.contrastText`,
      }}
    >
      <Stack spacing={1}>
        <Stack spacing={1}>
          <Stack spacing={1} direction="row">
            <Icon />
            <Typography variant="body1" sx={{ flexGrow: 1 }}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Typography>
          </Stack>

          <Stack spacing={0}>
            {summaries.map((summary, index) => (
              <Typography key={index} variant="body1">
                • {summary}
              </Typography>
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  )
}

export default React.memo(SummaryItem)
