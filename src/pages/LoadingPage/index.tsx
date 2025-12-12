import { Box, CircularProgress } from '@mui/material'
import React from 'react'

function LoadingSceen() {
  return (
    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CircularProgress />
    </Box>
  )
}

export default React.memo(LoadingSceen)
