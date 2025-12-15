import React, { useState } from 'react'
import { Tooltip, Box, IconButton } from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import RefreshIcon from '@mui/icons-material/Refresh'
import useCurrentPage from '../../hooks/useCurrentPage'

function RefreshButton() {
  const currentPage = useCurrentPage()
  const qc = useQueryClient()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const refreshData = async () => {
    setIsRefreshing(true)
    try {
      await qc.invalidateQueries({
        queryKey: ['babies-data'],
        exact: true,
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  if (currentPage !== 'content') {
    return null
  }

  return (
    <Tooltip title="Refresh data">
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <IconButton onClick={refreshData} disabled={isRefreshing}>
          <RefreshIcon
            sx={{
              ...(isRefreshing && {
                animation: 'spin 1s linear infinite',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
              }),
            }}
          />
        </IconButton>
      </Box>
    </Tooltip>
  )
}

export default React.memo(RefreshButton)
