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
        gridTemplateColumns: "repeat(2, 1fr)", // 2 items per row
        gap: 1, // spacing between items
      }}
    >
      {TABS.slice(1).map((tab) => (
        <SummaryItem key={`summary-tile-${tab}`} tab={tab} />
      ))}
    </Box>
  );
}

export default SummaryTab;
