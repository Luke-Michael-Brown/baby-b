import { useState } from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TABS_TO_ICON } from "../../atoms/selectedTabAtom";
import useTabSummary from "../../hooks/useTabSummary";
import dayjs, { Dayjs } from "dayjs";

interface Props {
  tab: string;
}

export const RANGES = ["Last Week", "Last 2 Weeks", "Last Month", "Last Year"] as const;

function SummaryItem({ tab }: Props) {
  const [startDate, setStartDate] = useState<Dayjs>(dayjs().subtract(7, "day"));
  const [endDate, setEndDate] = useState<Dayjs>(dayjs());

  const Icon = TABS_TO_ICON[tab];

  const summaries = useTabSummary({
    tab,
    startDate: startDate.toDate(),
    endDate: endDate.toDate(),
  });

  const handleRangeSelect = (_event: any, value: string | null) => {
    if (!value) return;

    if (value === "Last Week") {
      setStartDate(dayjs().subtract(7, "day"));
      setEndDate(dayjs());
    }

    if (value === "Last 2 Weeks") {
      setStartDate(dayjs().subtract(14, "day"));
      setEndDate(dayjs());
    }

    if (value === "Last Month") {
      setStartDate(dayjs().subtract(1, "month"));
      setEndDate(dayjs());
    }

    if (value === "Last Year") {
      setStartDate(dayjs().subtract(1, "year"));
      setEndDate(dayjs());
    }
  };

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
            <Typography
              key={`summary-${tab}-label`}
              variant="body1"
              component="span"
              sx={{ flexGrow: 1 }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Typography>
          </Stack>

          <Stack spacing={0}>
            {summaries.map((summary, index) => (
              <Typography
                key={`summary-${tab}-${index}`}
                variant="body1"
                component="span"
                sx={{ flexGrow: 1 }}
              >
                {`• ${summary}`}
              </Typography>
            ))}
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1}>
          <DatePicker
            label="Start"
            value={startDate}
            onChange={(v) => v && setStartDate(v)}
            slotProps={{
              textField: {
                sx: {
                  "& .MuiInputBase-input": {
                    fontSize: "0.8rem",
                  },
                },
              },
            }}
          />

          <DatePicker
            label="End"
            value={endDate}
            onChange={(v) => v && setEndDate(v)}
            slotProps={{
              textField: {
                sx: {
                  "& .MuiInputBase-input": {
                    fontSize: "0.8rem",
                  },
                },
              },
            }}
          />
        </Stack>

        <ToggleButtonGroup exclusive onChange={handleRangeSelect}>
          {RANGES.map((r) => (
            <ToggleButton
              sx={{
                color: `${tab}.contrastText`,
                fontWeight: "normal",
                "&.Mui-selected": {
                  color: `${tab}.contrastText`,
                  fontWeight: 900,
                },
                px: 1,
              }}
              key={r}
              value={r}
            >
              {r}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>
    </Paper>
  );
}

export default SummaryItem;
