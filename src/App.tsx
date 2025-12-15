import React, { useEffect } from 'react';
import { useAtom } from 'jotai';
import Header from './components/Header';
import Box from '@mui/material/Box';
import { useGoogleAPISetup } from './hooks/useGoogleAPI';
import useBabiesList from './hooks/useBabiesList';
import selectedBabyAtom from './atoms/selectedBabyAtom';
import LoginPage from './pages/LoginPage';
import LoadingPage from './pages/LoadingPage';
import ContentPage from './pages/ContentPage';
import useCurrentPage from './hooks/useCurrentPage';

export function App() {
  useGoogleAPISetup();

  const currentPage = useCurrentPage();
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
    </Box>
  );
}

export default React.memo(App);
