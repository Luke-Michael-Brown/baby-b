// This file defines the BabySelector component, a memoized React component
// that provides a dropdown interface for selecting a baby from the available
// list.
// It integrates with Jotai atoms to manage the selected baby state and uses a
// custom hook to fetch the babies list.
// The component renders a label and a Material-UI Select component, allowing
// users to switch between babies and update the application's data context
// accordingly.

import { memo } from 'react';
import { useAtom } from 'jotai';
import { Select, MenuItem, Box, Typography } from '@mui/material';

import type { SelectChangeEvent } from '@mui/material';
import selectedBabyAtom from '../../atoms/selectedBabyAtom';
import useBabiesList from '../../hooks/useBabiesList';

function BabySelector() {
  const [selectedBaby, setSelectedBaby] = useAtom(selectedBabyAtom);
  const { data: babiesList = [] } = useBabiesList();

  const onBabySelected = (event: SelectChangeEvent<string>) => {
    setSelectedBaby(event.target.value);
  };

  return (
    <Box
      sx={{
        flexDirection: 'row',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
      }}
    >
      <Typography variant="body1" component="div" sx={{ flexGrow: 1 }}>
        Baby:
      </Typography>
      <Select
        value={selectedBaby || ''}
        label="Baby"
        onChange={onBabySelected}
        size="small"
      >
        {babiesList.map(babyName => (
          <MenuItem key={babyName} value={babyName}>
            {babyName}
          </MenuItem>
        ))}
      </Select>
    </Box>
  );
}

export default memo(BabySelector);
