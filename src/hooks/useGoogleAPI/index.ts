import { useEffect, useCallback } from 'react';
import { atom, useAtom } from 'jotai';
import createCacheMap from '../../utils/createCacheMap';

type TokenClient = google.accounts.oauth2.TokenClient;
type TokenResponse = google.accounts.oauth2.TokenResponse;

const authAtom = atom<{
  accessToken?: string;
  isSignedIn: boolean;
  tokenClient: TokenClient | null;
}>({
  accessToken: undefined,
  isSignedIn: false,
  tokenClient: null,
});

const {
  cacheMap: idCache,
  addToCacheMap: addToIdCache,
  resetCacheMap: resetIdCache,
} = createCacheMap('baby_b_gapi_idcache');

/* ------------------------------------------------------------------ */
/* Setup / Bootstrap                                                   */
/* ------------------------------------------------------------------ */

export function useGoogleAPISetup() {
  const [{ tokenClient }, setAuth] = useAtom(authAtom);

  useEffect(() => {
    const scriptId = 'gis-script';

    const initClient = () => {
      if (!window.google?.accounts?.oauth2) return;

      const client = window.google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID!,
        scope:
          'https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.readonly',
        callback: (tokenResponse: TokenResponse) => {
          if (!tokenResponse.access_token) return;

          const expiresAt =
            Date.now() + (parseFloat(tokenResponse.expires_in) ?? 3600) * 1000;

          localStorage.setItem(
            'baby_b_gapi_auth',
            JSON.stringify({
              token: tokenResponse.access_token,
              expiresAt,
            }),
          );

          setAuth(old => ({
            ...old,
            accessToken: tokenResponse.access_token,
            isSignedIn: true,
          }));
        },
      });

      setAuth(old => ({ ...old, tokenClient: client }));
    };

    if (document.getElementById(scriptId)) {
      initClient();
      return;
    }

    const script = document.createElement('script');
    script.id = scriptId;
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initClient;
    document.body.appendChild(script);
  }, [setAuth]);

  const tryRestoreToken = useCallback(() => {
    if (!tokenClient) return;

    const saved = localStorage.getItem('baby_b_gapi_auth');
    if (!saved) return;

    const { token, expiresAt } = JSON.parse(saved) as {
      token?: string;
      expiresAt?: number;
    };

    if (token && expiresAt && Date.now() < expiresAt) {
      setAuth(old => ({
        ...old,
        accessToken: token,
        isSignedIn: true,
      }));
    } else {
      tokenClient.requestAccessToken({ prompt: '' });
    }
  }, [tokenClient, setAuth]);

  useEffect(() => {
    if (tokenClient) tryRestoreToken();
  }, [tokenClient, tryRestoreToken]);

  useEffect(() => {
    if (!tokenClient) return;

    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        tryRestoreToken();
      }
    };

    window.addEventListener('focus', tryRestoreToken);
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      window.removeEventListener('focus', tryRestoreToken);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [tokenClient, tryRestoreToken]);

  // iOS PWA resume detection
  useEffect(() => {
    if (!tokenClient) return;

    let last = Date.now();
    const interval = setInterval(() => {
      const now = Date.now();
      if (now - last > 3000) tryRestoreToken();
      last = now;
    }, 2000);

    return () => clearInterval(interval);
  }, [tokenClient, tryRestoreToken]);
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

export default function useGoogleAPI() {
  const [{ accessToken, isSignedIn, tokenClient }, setAuth] = useAtom(authAtom);

  const signIn = useCallback(() => {
    if (!tokenClient) throw new Error('GIS not initialized');
    tokenClient.requestAccessToken({ prompt: 'consent' });
  }, [tokenClient]);

  const signOut = useCallback(async () => {
    if (accessToken) {
      try {
        await fetch(
          `https://oauth2.googleapis.com/revoke?token=${accessToken}`,
          {
            method: 'POST',
            headers: {
              'Content-type': 'application/x-www-form-urlencoded',
            },
          },
        );
      } catch (err) {
        console.warn('Token revoke failed', err);
      }
    }

    localStorage.removeItem('baby_b_gapi_auth');
    localStorage.removeItem('baby_b_gapi_idcache');

    setAuth(old => ({
      ...old,
      accessToken: undefined,
      isSignedIn: false,
    }));

    window.location.reload();
  }, [accessToken, setAuth]);

  /* ------------------------- Drive Helpers ------------------------- */

  const resolvePath = useCallback(
    async (filePath: string, createMissing = false, retry = true) => {
      if (!accessToken) {
        throw new Error('No access token. Please sign in first.');
      }

      const parts = filePath.split('/');
      const fileName = parts.pop()!;
      let parentId = 'root';

      try {
        for (const folderName of parts) {
          const cacheKey = `${parentId}/${folderName}`;

          if (idCache.has(cacheKey)) {
            parentId = idCache.get(cacheKey)!;
            continue;
          }

          const res = await fetch(
            `https://www.googleapis.com/drive/v3/files?q=name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false and ('${parentId}' in parents or sharedWithMe)&fields=files(id)&includeItemsFromAllDrives=true&supportsAllDrives=true&corpora=allDrives`,
            {
              headers: { Authorization: `Bearer ${accessToken}` },
            },
          );

          const data = await res.json();

          if (data.files?.length) {
            parentId = data.files[0].id;
            addToIdCache(cacheKey, parentId);
            continue;
          }

          if (!createMissing) {
            throw new Error(`Folder "${folderName}" not found`);
          }

          const createRes = await fetch(
            'https://www.googleapis.com/drive/v3/files',
            {
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
            },
          );

          const created = await createRes.json();
          parentId = created.id;
          addToIdCache(cacheKey, parentId);
        }

        const fileKey = `${parentId}/${fileName}`;

        if (idCache.has(fileKey)) {
          return { parentId, fileName, fileId: idCache.get(fileKey)! };
        }

        const fileRes = await fetch(
          `https://www.googleapis.com/drive/v3/files?q=name='${fileName}' and trashed=false and ('${parentId}' in parents or sharedWithMe)&fields=files(id)&includeItemsFromAllDrives=true&supportsAllDrives=true&corpora=allDrives`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          },
        );

        const fileData = await fileRes.json();

        if (fileData.files?.length) {
          const id = fileData.files[0].id;
          addToIdCache(fileKey, id);
          return { parentId, fileName, fileId: id };
        }

        return { parentId, fileName, fileId: null };
      } catch (err) {
        if (retry) {
          resetIdCache();
          return resolvePath(filePath, createMissing, false);
        }
        throw err;
      }
    },
    [accessToken],
  );

  const fetchJsonFromDrive = useCallback(
    async (filePath = 'baby_b_tracker/babies_data.json') => {
      const { fileId } = await resolvePath(filePath);
      if (!fileId) throw new Error('File not found');

      const res = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      return res.json();
    },
    [accessToken, resolvePath],
  );

  const uploadJsonToDrive = useCallback(
    async (data: unknown, filePath = 'baby_b_tracker/babies_data.json') => {
      const { parentId, fileName, fileId } = await resolvePath(filePath, true);

      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
      });

      if (fileId) {
        await fetch(
          `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
          {
            method: 'PATCH',
            headers: { Authorization: `Bearer ${accessToken}` },
            body: blob,
          },
        );

        return { updated: true, fileId };
      }

      const form = new FormData();
      form.append(
        'metadata',
        new Blob([JSON.stringify({ name: fileName, parents: [parentId] })], {
          type: 'application/json',
        }),
      );
      form.append('file', blob);

      const res = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart',
        {
          method: 'POST',
          headers: { Authorization: `Bearer ${accessToken}` },
          body: form,
        },
      );

      const created = await res.json();
      addToIdCache(`${parentId}/${fileName}`, created.id);

      return { created: true, fileId: created.id };
    },
    [accessToken, resolvePath],
  );

  return {
    isSignedIn,
    accessToken,
    signIn,
    signOut,
    fetchJsonFromDrive,
    uploadJsonToDrive,
  };
}
