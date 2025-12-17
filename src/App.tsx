import { memo, useEffect } from 'react';
import { useAtom } from 'jotai';
import Box from '@mui/material/Box';

import selectedBabyAtom from './atoms/selectedBabyAtom';
import Header from './components/Header';
import useBabiesList from './hooks/useBabiesList';
import useCurrentPage from './hooks/useCurrentPage';
import useGoogleAPI, { useGoogleAPISetup } from './hooks/useGoogleAPI';
import ContentPage from './pages/ContentPage';
import LoadingPage from './pages/LoadingPage';
import LoginPage from './pages/LoginPage';
import Footer from './components/Footer';

export function App() {
  useGoogleAPISetup();

  const currentPage = useCurrentPage();
  const { isSignedIn } = useGoogleAPI();
  const { data: babiesList, isLoading } = useBabiesList();
  const [selectedBaby, setSelectedBaby] = useAtom(selectedBabyAtom);

  useEffect(() => {
    if (
      selectedBaby === null &&
      !isLoading &&
      babiesList &&
      babiesList.length > 0
    ) {
      setSelectedBaby(babiesList[0]);
    }
  }, [selectedBaby, babiesList, isLoading, setSelectedBaby]);

  return (
    <Box
      sx={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        height: '100vh',
        width: '100%',
      }}
    >
      <Header />
      {currentPage === 'login' ? (
        <LoginPage />
      ) : currentPage === 'loading' ? (
        <LoadingPage />
      ) : (
        <ContentPage />
      )}
      {isSignedIn ? <Footer /> : null}
    </Box>
  );
}

export default memo(App);
