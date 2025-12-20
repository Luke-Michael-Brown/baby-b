// Tab component that displays summarized statistics and trends for baby data
// over a selected date range, using collapsible sections and charts for better
// visualization.

import { memo } from 'react';
import Box from '@mui/material/Box';

import SummaryItem from '../../components/SummaryItem';
import config from '../../config';
import DateRangePicker from '../../components/DateRangePicker';

export const RANGES = [
  'Last Week',
  'Last 2 Weeks',
  'Last Month',
  'Last Year',
] as const;

function SummaryTab() {
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
      <DateRangePicker />

      {Object.keys(config)
        .filter(tab => config[tab].getSummary)
        .map(tab => (
          <SummaryItem key={`summary-tile-${tab}`} tab={tab} />
        ))}
    </Box>
  );
}

export default memo(SummaryTab);
