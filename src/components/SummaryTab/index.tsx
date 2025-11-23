import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { useAtom } from "jotai";
import dayjs from "dayjs";

import { TABS } from "../../atoms/selectedTabAtom";
import SummaryItem from "../SummaryItem";
import {
  summayStartDateAtom,
  summaryEndDateAtom,
} from "../../atoms/summaryDatesAtom";

export const RANGES = ["Last Week", "Last 2 Weeks", "Last Month", "Last Year"] as const;

function SummaryTab() {
  const [startDate, setStartDate] = useAtom(summayStartDateAtom);
  const [endDate, setEndDate] = useAtom(summaryEndDateAtom);

  const handleRangeSelect = (_event: any, value: string | null) => {
    if (!value) return;

    const ranges: Record<string, number> = {
      "Last Week": 7,
      "Last 2 Weeks": 14,
      "Last Month": 30,
      "Last Year": 365,
    };

    setStartDate(dayjs().subtract(ranges[value], "day"));
    setEndDate(dayjs());
  };

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: "grid",
        gridTemplateColumns: "repeat(1, 1fr)",
        gap: 1.5,
        px: 1.5,
        py: 1.5,
      }}
    >
      <Paper sx={{ p: 1 }}>
        <Box sx={{ display: "flex", gap: 2 }}>
          {/* Left side: Start & End stacked */}
          <Stack spacing={1}>
            <DatePicker
              label="Start"
              value={startDate}
              onChange={(v) => v && setStartDate(v)}
            />
            <DatePicker
              label="End"
              value={endDate}
              onChange={(v) => v && setEndDate(v)}
            />
          </Stack>

          {/* Right side: Range buttons in 2x2 */}
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gridTemplateRows: "repeat(2, auto)",
              gap: 1,
            }}
          >
            {RANGES.map((r) => (
              <ToggleButton
                key={r}
                value={r}
                onClick={() => handleRangeSelect(null, r)}
                sx={{ width: "100%" }}
              >
                {r}
              </ToggleButton>
            ))}
          </Box>
        </Box>
      </Paper>

      {TABS.slice(1).map((tab) => (
        <SummaryItem key={`summary-tile-${tab}`} tab={tab} />
      ))}
    </Box>
  );
}

export default SummaryTab;
