import * as React from "react";
import { useAtom } from "jotai";
import { useQueryClient } from '@tanstack/react-query';
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ChildFriendlyIcon from "@mui/icons-material/ChildFriendly";
import RefreshIcon from "@mui/icons-material/Refresh";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LogoutIcon from "@mui/icons-material/Logout";
import useGoogleAPI from "../../hooks/useGoogleAPI";
import { useTheme } from "@mui/material/styles";
import selectedBabyAtom from "../../atoms/selectedBabyAtom";
import useBabiesList from "../../hooks/useBabiesList";

const settings = ["Logout"];

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
  const { data: babiesList } = useBabiesList();
  const [selectedBaby, setSelectedBaby] = useAtom(selectedBabyAtom);
  const onBabySelected = (event: SelectChangeEvent) => {
    setSelectedBaby(event.target.value as string);
  };

  const qc = useQueryClient();
  const refreshData = () => {
    qc.invalidateQueries({
      queryKey: ['babies-data'],
      exact: true,
    })
  }

  return (
    <Box>
      <AppBar position="static">
        <Stack sx={{ px: 2, py: 1 }} direction="row" spacing={1} alignItems="center">
          <ChildFriendlyIcon />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Baby B
          </Typography>
          <Select value={selectedBaby} label="Bay" onChange={onBabySelected}>
            {babiesList.map((babyName) => (
              <MenuItem value={babyName}>{babyName}</MenuItem>
            ))}
          </Select>
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
      </AppBar>
    </Box>
  );
}
export default Header;
