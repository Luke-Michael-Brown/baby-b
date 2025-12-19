import {
  Paper,
  Stack,
  Typography,
  IconButton,
  Divider,
  Collapse,
  Box,
  ToggleButton,
} from '@mui/material';
import DateRangeIcon from '@mui/icons-material/DateRange';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { memo, useState } from 'react';
import { RANGES } from '../../tabs/SummaryTab';
import dayjs from 'dayjs';
import { useAtom } from 'jotai';
import {
  summayStartDateAtom,
  summaryEndDateAtom,
} from '../../atoms/summaryDatesAtom';

function DateRangePicker() {
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
    <Paper sx={{ p: 1 }}>
      {/* Header row */}
      <Stack direction="row" alignItems="center" justifyContent="space-between">
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
  );
}

export default memo(DateRangePicker);
