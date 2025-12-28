// React component for SummaryItem
import { memo, useCallback } from 'react';
import { useSetAtom } from 'jotai';
import TableChartIcon from '@mui/icons-material/TableChart';
import { IconButton } from '@mui/material';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import selectedTabAtom from '../../atoms/selectedTabAtom';
import config from '../../config';
import useTabSummary from '../../hooks/useTabSummary';

interface Props {
  tab: string;
}

function SummaryItem({ tab }: Props) {
  const Icon = config[tab].Icon;
  const summaries = useTabSummary({ tab });

  const setSelectedTab = useSetAtom(selectedTabAtom);

  const goToTab = useCallback(() => {
    setSelectedTab(tab);
  }, [setSelectedTab, tab]);

  return summaries.length > 0 ? (
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
            <Icon sx={{ fontSize: '2em' }} />
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Typography>

            <IconButton sx={{ p: 0 }} onClick={goToTab} color="inherit">
              <TableChartIcon sx={{ fontSize: '1.25em' }} />
            </IconButton>
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
  ) : null;
}

export default memo(SummaryItem);
