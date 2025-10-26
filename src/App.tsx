import { useState, useEffect } from "react";
import { useAtom } from 'jotai';
import {
  ThemeProvider,
  CssBaseline,
  Alert,
  Button,
  CircularProgress,
} from "@mui/material";
import Header from "./components/Header";
import TabBar from "./components/TabBar";
import TabContent from "./components/TabContent";
import Footer from "./components/Footer";
import Box from "@mui/material/Box";
import { getTheme } from "./theme";
import useGoogleAPI from "./hooks/useGoogleAPI";
import useBabiesList from "./hooks/useBabiesList";
import selectedBabyAtom from "./atoms/selectedBabyAtom";

interface Props {
  setMode: (newMode: "light" | "dark") => void;
}

function App({ setMode }: Props) {
  const { data: babiesList, isLoading } = useBabiesList();
  const [selectedBaby, setSelectedBaby] = useAtom(selectedBabyAtom);
  useEffect(() => {
    if (selectedBaby === null && !isLoading) {
      setSelectedBaby(babiesList[0])
    }
  }, [selectedBaby, babiesList]);

  return isLoading || !selectedBaby ? (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        height: "100vh",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress />
    </Box>
  ) : (
    <Box
      sx={{
        display: "flex",
        flex: 1,
        flexDirection: "column",
        height: "100vh",
      }}
    >
      <Header setMode={setMode} />
      <TabBar />
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", p: 2 }}>
        <TabContent />
      </Box>
      <Footer />
    </Box>
  );
}

function AppContainer() {
  const [mode, setMode] = useState<"light" | "dark">(
    localStorage.getItem("mode") === "dark" ? "dark" : "light",
  );
  const theme = getTheme(mode);
  const { isSignedIn, signIn, accessToken } = useGoogleAPI();

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {isSignedIn ? (
        <App setMode={setMode} />
      ) : (
        <Box
          sx={{
            display: "flex",
            flex: 1,
            flexDirection: "column",
            height: "100vh",
          }}
        >
          <Alert severity="info" sx={{ mb: 2 }}>
            Please sign in with Google Drive to use Baby B.
          </Alert>
          <Button variant="contained" onClick={signIn}>
            Sign in
          </Button>
        </Box>
      )}
    </ThemeProvider>
  );
}

export default AppContainer;
