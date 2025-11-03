import Box from "@mui/material/Box";
import { TABS } from "../../atoms/selectedTabAtom";
import SummaryItem from "../SummaryItem";

function SummaryTab() {
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
      {TABS.slice(1).map((tab) => (
        <SummaryItem key={`summary-tile-${tab}`} tab={tab} />
      ))}
    </Box>
  );
}

export default SummaryTab;
