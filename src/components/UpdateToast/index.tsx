import { useEffect, useRef, useState } from 'react'
import { Snackbar } from '@mui/material'
import useBabiesData from '../../hooks/useBabiesData'

export default function UpdateToast() {
  const { data: babiesData } = useBabiesData()
  const [open, setOpen] = useState(false)
  const prevDataRef = useRef<any>(null)

  useEffect(() => {
    // Only trigger if data changes after initial load
    if (babiesData && prevDataRef.current && babiesData !== prevDataRef.current) {
      setOpen(true)
    }
    prevDataRef.current = babiesData
  }, [babiesData])

  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={() => setOpen(false)}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      message="Data has been updated"
    />
  )
}
