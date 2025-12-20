// This file defines the main App component, which serves as the root of the
// React application.
// It integrates Google API authentication, manages global state for selected
// baby and current page,
// and conditionally renders different pages (Login, Loading, Content) along
// with Header and Footer components.
// The component uses Jotai atoms for state management and Material-UI for
// styling,
// ensuring a responsive layout that fills the viewport.

import { memo, useEffect } from 'react';
import { useAtom } from 'jotai';
import Box from '@mui/material/Box';

import selectedBabyAtom from './atoms/selectedBabyAtom';
import Header from './components/Header';
import useBabiesList from './hooks/useBabiesList';
import useCurrentPage from './hooks/useCurrentPage';
import { useGoogleAPISetup } from './hooks/useGoogleAPI';
import ContentPage from './pages/ContentPage';
import LoadingPage from './pages/LoadingPage';
import LoginPage from './pages/LoginPage';

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

export default memo(App);
