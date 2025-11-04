import { useAtom, useAtomValue } from "jotai";
import { useQueryClient } from "@tanstack/react-query";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import RefreshIcon from "@mui/icons-material/Refresh";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LogoutIcon from "@mui/icons-material/Logout";
import type { SelectChangeEvent } from "@mui/material/Select";

import useGoogleAPI from "../../hooks/useGoogleAPI";
import { useTheme } from "@mui/material/styles";
import selectedBabyAtom from "../../atoms/selectedBabyAtom";
import useBabiesList from "../../hooks/useBabiesList";
import ThemedAppBar from "../ThemedAppBar";
import selectedTabAtom, { TABS, TABS_TO_ICON } from "../../atoms/selectedTabAtom";

interface Props {
  setMode: (newMode: "light" | "dark") => void;
}

function Header({ setMode }: Props) {
  const { signOut } = useGoogleAPI();
  const theme = useTheme();
  const mode = theme?.palette?.mode ?? "light";

  const onToggleMode = () => {
    setMode(mode === "light" ? "dark" : "light");
  };

  const { data: babiesList = [] } = useBabiesList();
  const [selectedBaby, setSelectedBaby] = useAtom(selectedBabyAtom);
  const selectedTab = useAtomValue(selectedTabAtom);
  const tab = TABS[selectedTab];

  const onBabySelected = (event: SelectChangeEvent<string>) => {
    setSelectedBaby(event.target.value);
  };

  const qc = useQueryClient();
  const refreshData = () => {
    qc.invalidateQueries({
      queryKey: ["babies-data"],
      exact: true,
    });
  };

  const Icon = TABS_TO_ICON[tab];

  return (
    <Box>
      <ThemedAppBar color="primary" position="static">
        <Stack sx={{ px: 2, py: 1 }} direction="row" alignItems="center">
          <Stack spacing={1} direction="row" alignItems="center">
            <Icon sx={{ fontSize: "3em" }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Baby B
            </Typography>
            <Select
              value={selectedBaby || ""}
              label="Baby"
              onChange={onBabySelected}
              size="small"
            >
              {babiesList.map((babyName) => (
                <MenuItem key={babyName} value={babyName}>
                  {babyName}
                </MenuItem>
              ))}
            </Select>
          </Stack>

          <Stack sx={{ ml: "auto" }} direction="row" spacing={1} alignItems="center">
            <Tooltip title="Toggle theme">
              <IconButton onClick={onToggleMode}>
                {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Refresh data">
              <IconButton onClick={refreshData}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="Sign out">
              <IconButton onClick={signOut}>
                <LogoutIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </ThemedAppBar>
    </Box>
  );
}

export default Header;
