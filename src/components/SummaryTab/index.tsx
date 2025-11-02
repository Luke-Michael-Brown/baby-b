import Box from "@mui/material/Box";
import { TABS } from "../../atoms/selectedTabAtom";
import SummaryItem from "../SummaryItem";

function SummaryTab() {
  return (
    <Box
      sx={{
        flexGrow: 1,
        maxHeight: "100%",
        overflow: "auto",
        display: "grid",
        gridTemplateColumns: "repeat(1, 1fr)", // 1 item per row
        gap: 1, // spacing between items
        pb: "64px", // add bottom padding equal to footer height
      }}
    >
      {TABS.slice(1).map((tab) => (
        <SummaryItem key={`summary-tile-${tab}`} tab={tab} />
      ))}
    </Box>
  );
}

export default SummaryTab;
