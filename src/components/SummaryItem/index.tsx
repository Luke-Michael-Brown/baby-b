import { useState } from "react";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import ToggleButton from "@mui/material/ToggleButton";
import { TABS_TO_ICON } from "../../atoms/selectedTabAtom";
import useTabSummary from "../../hooks/useTabSummary";

interface Props {
  tab: string;
}

export const RANGES = ["Last Week", "Last Month", "Last Year"] as const;

function SummaryItem({ tab }: Props) {
  const [range, setRange] = useState(RANGES[0]);
  const Icon = TABS_TO_ICON[tab];
  const summaries = useTabSummary({ tab, range });

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
        <Stack spacing={1} direction="row">
          <Icon />
          <Stack spacing={0}>
            {summaries.map((summary, index) => (
              <Typography
                key={`summary-${tab}-${index}`}
                variant="body1"
                component="span"
                sx={{ flexGrow: 1 }}
              >
                {summary}
              </Typography>
            ))}
          </Stack>
        </Stack>
        <ToggleButtonGroup
          value={range}
          exclusive
          onChange={(event, newRange) => {
            if (newRange !== null) setRange(newRange);
          }}
          size="small"
        >
          {RANGES.map((r) => (
            <ToggleButton key={r} value={r}>
              {r}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>
    </Paper>
  );
}

export default SummaryItem;
