import { useEffect, useCallback } from 'react'
import { atom, useAtom } from 'jotai'
import createCacheMap from '../../utils/createCacheMap'

const authAtom = atom<{
  accessToken: string | undefined
  isSignedIn: boolean
  tokenClient: any
}>({
  accessToken: undefined,
  isSignedIn: false,
  tokenClient: null,
})

const {
  cacheMap: idCache,
  addToCacheMap: addToIdCache,
  resetCacheMap: resetIdCache,
} = createCacheMap('baby_b_gapi_idcache')

export function useGoogleAPISetup() {
  const [{ tokenClient }, setAuth] = useAtom(authAtom)

  // ---------------------------------------------------------
  // GIS Script Loader
  // ---------------------------------------------------------
  useEffect(() => {
    const scriptId = 'gis-script'

    function initClient() {
      if (!(window as any).google) return

      const client = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID!,
        scope:
          'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.readonly',
        callback: (tokenResponse: any) => {
          if (tokenResponse.access_token) {
            const expiresAt = Date.now() + (tokenResponse.expires_in || 3600) * 1000

            localStorage.setItem(
              'baby_b_gapi_auth',
              JSON.stringify({ token: tokenResponse.access_token, expiresAt })
            )

            setAuth(oldAuth => ({
              ...oldAuth,
              accessToken: tokenResponse.access_token,
              isSignedIn: true,
            }))
          }
        },
      })

      setAuth(oldAuth => ({
        ...oldAuth,
        tokenClient: client,
      }))
    }

    if (document.getElementById(scriptId)) {
      initClient()
      return
    }

    const s = document.createElement('script')
    s.id = scriptId
    s.src = 'https://accounts.google.com/gsi/client'
    s.async = true
    s.defer = true
    s.onload = initClient
    document.body.appendChild(s)
  }, [])

  // ---------------------------------------------------------
  // Restore token
  // ---------------------------------------------------------
  const tryRestoreToken = useCallback(() => {
    const saved = localStorage.getItem('baby_b_gapi_auth')
    if (!saved || !tokenClient) return

    const { token, expiresAt } = JSON.parse(saved)

    if (token && Date.now() < expiresAt) {
      setAuth(oldAuth => ({
        ...oldAuth,
        accessToken: token,
        isSignedIn: true,
      }))
    } else {
      tokenClient.requestAccessToken({ prompt: '' })
    }
  }, [tokenClient])

  useEffect(() => {
    if (tokenClient) tryRestoreToken()
  }, [tokenClient, tryRestoreToken])

  // ---------------------------------------------------------
  // Resume listeners
  // ---------------------------------------------------------
  useEffect(() => {
    if (!tokenClient) return

    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        tryRestoreToken()
      }
    }

    window.addEventListener('focus', tryRestoreToken)
    document.addEventListener('visibilitychange', onVisible)

    return () => {
      window.removeEventListener('focus', tryRestoreToken)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [tokenClient, tryRestoreToken])

  // iOS PWA resume detection
  useEffect(() => {
    if (!tokenClient) return

    let last = Date.now()

    const interval = setInterval(() => {
      const now = Date.now()
      if (now - last > 3000) {
        tryRestoreToken()
      }
      last = now
    }, 2000)

    return () => clearInterval(interval)
  }, [tokenClient, tryRestoreToken])
}

export default function useGoogleAPI() {
  const [{ accessToken, isSignedIn, tokenClient }, setAuth] = useAtom(authAtom)

  // ---------------------------------------------------------
  // Sign In / Sign Out
  // ---------------------------------------------------------
  const signIn = useCallback(() => {
    if (!tokenClient) throw new Error('GIS not initialized')
    tokenClient.requestAccessToken({ prompt: 'consent' })
  }, [tokenClient])

  const signOut = useCallback(async () => {
    if (accessToken) {
      try {
        await fetch(`https://oauth2.googleapis.com/revoke?token=${accessToken}`, {
          method: 'POST',
          headers: { 'Content-type': 'application/x-www-form-urlencoded' },
        })
      } catch (err) {
        console.warn('Token revoke failed', err)
      }
    }

    localStorage.removeItem('baby_b_gapi_auth')
    localStorage.removeItem('baby_b_gapi_idcache')

    setAuth(oldAuth => ({
      ...oldAuth,
      accessToken: undefined,
      isSignedIn: false,
    }))

    window.location.reload()
  }, [accessToken])

  // ---------------------------------------------------------
  // resolvePath (with persistent caching + auto clear-and-retry)
  // ---------------------------------------------------------
  const resolvePath = useCallback(
    async (filePath: string, createMissing = false, retry = true) => {
      if (!accessToken) throw new Error('No access token. Please sign in first.')

      const parts = filePath.split('/')
      const fileName = parts.pop()!
      let parentId: string = 'root'

      try {
        // ---------- FOLDER WALK ----------
        for (const folderName of parts) {
          const cacheKey = `${parentId}/${folderName}`

          if (idCache.has(cacheKey)) {
            parentId = idCache.get(cacheKey)!
            continue
          }

          const folderRes = await fetch(
            `https://www.googleapis.com/drive/v3/files?q=name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false and ('${parentId}' in parents or sharedWithMe)&fields=files(id,name)&includeItemsFromAllDrives=true&supportsAllDrives=true&corpora=allDrives`,
            { headers: { Authorization: `Bearer ${accessToken}` } }
          )

          const data = await folderRes.json()

          if (data.files?.length) {
            parentId = data.files[0].id
            addToIdCache(cacheKey, parentId)
            continue
          }

          // Create folder if needed
          if (createMissing) {
            const createRes = await fetch('https://www.googleapis.com/drive/v3/files', {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name: folderName,
                mimeType: 'application/vnd.google-apps.folder',
                parents: [parentId],
              }),
            })

            const created = await createRes.json()
            parentId = created.id
            addToIdCache(cacheKey, parentId)
            continue
          }

          throw new Error(`Folder "${folderName}" not found.`)
        }

        // ---------- FILE LOOKUP ----------
        const fileKey = `${parentId}/${fileName}`

        if (idCache.has(fileKey)) {
          return { parentId, fileName, fileId: idCache.get(fileKey)! }
        }

        const fileRes = await fetch(
          `https://www.googleapis.com/drive/v3/files?q=name='${fileName}' and trashed=false and ('${parentId}' in parents or sharedWithMe)&fields=files(id,name)&includeItemsFromAllDrives=true&supportsAllDrives=true&corpora=allDrives`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        )

        const fileData = await fileRes.json()

        if (fileData.files?.length) {
          const id = fileData.files[0].id
          addToIdCache(fileKey, id)
          return { parentId, fileName, fileId: id }
        }

        return { parentId, fileName, fileId: null }
      } catch (err) {
        if (retry) {
          console.warn('ID cache invalidated → clearing and retrying resolvePath()')
          resetIdCache()
          return resolvePath(filePath, createMissing, false)
        }
        throw err
      }
    },
    [accessToken]
  )

  // ---------------------------------------------------------
  // Fetch JSON
  // ---------------------------------------------------------
  const fetchJsonFromDrive = useCallback(
    async (filePath = 'baby_b_tracker/babies_data.json') => {
      const { fileId } = await resolvePath(filePath)
      if (!fileId) throw new Error(`File "${filePath}" not found.`)

      const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })

      return res.json()
    },
    [accessToken, resolvePath]
  )

  // ---------------------------------------------------------
  // Upload JSON
  // ---------------------------------------------------------
  const uploadJsonToDrive = useCallback(
    async (data: any, filePath = 'baby_b_tracker/babies_data.json') => {
      const { parentId, fileName, fileId } = await resolvePath(filePath, true)

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      })

      if (fileId) {
        const res = await fetch(
          `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
          {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${accessToken}` },
            body: blob,
          }
        )

        if (!res.ok) throw new Error('Failed to update JSON.')
        return { updated: true, fileId }
      }

      const metadata = { name: fileName, parents: [parentId] }
      const form = new FormData()
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }))
      form.append('file', blob)

      const res = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}` },
          body: form,
        }
      )

      const created = await res.json()

      addToIdCache(`${parentId}/${fileName}`, created.id)

      return { created: true, fileId: created.id }
    },
    [accessToken, resolvePath]
  )

  return {
    isSignedIn,
    signIn,
    signOut,
    accessToken,
    fetchJsonFromDrive,
    uploadJsonToDrive,
  }
}
