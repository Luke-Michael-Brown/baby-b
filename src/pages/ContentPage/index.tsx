import React from 'react';
import Footer from '../../components/Footer';
import SecondaryBar from '../../components/SecondaryBar';
import TabContent from '../../components/TabContent';
import { Box } from '@mui/material';

function ContentPage() {
  return (
    <>
      <SecondaryBar />
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          pb: '98px',
        }}
      >
        <TabContent />
      </Box>
      <Footer />
    </>
  );
}

export default React.memo(ContentPage);
