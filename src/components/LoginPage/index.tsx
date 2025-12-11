import { Alert, Button } from '@mui/material'
import React from 'react'
import useGoogleAPI from '../../hooks/useGoogleAPI'

function LoginPage() {
  const { signIn } = useGoogleAPI()

  return (
    <>
      <Alert severity="info" sx={{ mb: 2 }}>
        Please sign in with Google Drive to use Baby B.
      </Alert>
      <Button variant="contained" onClick={signIn}>
        Sign in
      </Button>
    </>
  )
}

export default React.memo(LoginPage)
