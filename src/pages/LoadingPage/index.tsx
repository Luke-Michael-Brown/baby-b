import { memo, useState, useEffect } from 'react';
import { Box, CircularProgress, Fade } from '@mui/material';
import BedroomBabyIcon from '@mui/icons-material/BedroomBaby';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import ChildFriendlyIcon from '@mui/icons-material/ChildFriendly';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import EscalatorWarningIcon from '@mui/icons-material/EscalatorWarning';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import StrollerIcon from '@mui/icons-material/Stroller';

const ICONS = [
  BedroomBabyIcon,
  ChildCareIcon,
  FamilyRestroomIcon,
  ChildFriendlyIcon,
  Diversity1Icon,
  EscalatorWarningIcon,
  StrollerIcon,
];

function LoadingScreen() {
  const [index, setIndex] = useState(Math.floor(Math.random() * ICONS.length));

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(prevIndex => (prevIndex + 1) % ICONS.length);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  const ActiveIcon = ICONS[index];

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: 72,
          height: 72,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <CircularProgress
          size={72}
          thickness={3.5}
          sx={{ color: 'primary.light' }}
        />

        {/* We use the key property to trigger the entrance animation on swap */}
        <ActiveIcon
          key={index}
          sx={{
            position: 'absolute',
            fontSize: '2.5rem',
            animation: 'fadeInPop 0.3s ease-out',
            '@keyframes fadeInPop': {
              '0%': {
                opacity: 0,
                transform: 'scale(0.5)',
              },
              '100%': {
                opacity: 1,
                transform: 'scale(1)',
              },
            },
          }}
        />
      </Box>
    </Box>
  );
}

export default memo(LoadingScreen);
