import { memo, useState } from 'react';
import { useAtom } from 'jotai';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import DateRangeIcon from '@mui/icons-material/DateRange';
import dayjs from 'dayjs';

import {
  summayStartDateAtom,
  summaryEndDateAtom,
} from '../../atoms/summaryDatesAtom';
import SummaryItem from '../../components/SummaryItem';
import config from '../../config';
import { Typography, IconButton, Divider, Collapse } from '@mui/material';

export const RANGES = [
  'Last Week',
  'Last 2 Weeks',
  'Last Month',
  'Last Year',
] as const;

function SummaryTab() {
  const [startDate, setStartDate] = useAtom(summayStartDateAtom);
  const [endDate, setEndDate] = useAtom(summaryEndDateAtom);
  const [open, setOpen] = useState(false);

  const handleRangeSelect = (_event: unknown, value: string | null) => {
    if (!value) return;

    const ranges: Record<string, number> = {
      'Last Week': 7,
      'Last 2 Weeks': 14,
      'Last Month': 30,
      'Last Year': 365,
    };

    setStartDate(
      dayjs()
        .startOf('day')
        .subtract(ranges[value] + 1, 'day'),
    );
    setEndDate(dayjs().endOf('day').subtract(1, 'day'));
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'grid',
        gridTemplateColumns: 'repeat(1, 1fr)',
        gap: 1,
        px: 1,
        py: 1,
      }}
    >
      <Paper sx={{ p: 1 }}>
        {/* Header row */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <DateRangeIcon />
            <Typography variant="subtitle2">Date Range</Typography>
          </Stack>

          <IconButton
            size="small"
            onClick={() => setOpen(o => !o)}
            sx={{
              transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 200ms',
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        </Stack>

        <Divider sx={{ mb: 1 }} />

        {/* Collapsible content */}
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Stack spacing={1}>
            {/* DatePickers */}
            <Stack direction="row" spacing={1}>
              <DatePicker
                label="Start"
                value={startDate}
                onChange={v => v && setStartDate(v.startOf('day'))}
                sx={{ flex: 1 }}
              />
              <DatePicker
                label="End"
                value={endDate}
                onChange={v => v && setEndDate(v.endOf('day'))}
                sx={{ flex: 1 }}
              />
            </Stack>

            {/* Range buttons */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 1,
              }}
            >
              {RANGES.map(r => (
                <ToggleButton
                  key={r}
                  value={r}
                  onClick={() => handleRangeSelect(null, r)}
                  sx={{ width: '100%' }}
                >
                  {r}
                </ToggleButton>
              ))}
            </Box>
          </Stack>
        </Collapse>
      </Paper>

      {Object.keys(config)
        .filter(tab => config[tab].summayItems)
        .map(tab => (
          <SummaryItem key={`summary-tile-${tab}`} tab={tab} />
        ))}
    </Box>
  );
}

export default memo(SummaryTab);
