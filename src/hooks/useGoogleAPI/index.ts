import { useState, useEffect, useCallback } from 'react';

export default function useGoogleAPI() {
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined);
  const [isSignedIn, setSignedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [tokenClient, setTokenClient] = useState<any>(null);

  useEffect(() => {
    const scriptId = 'gis-script';
    if (!document.getElementById(scriptId)) {
      const s = document.createElement('script');
      s.id = scriptId;
      s.src = 'https://accounts.google.com/gsi/client';
      s.async = true;
      s.defer = true;
      s.onload = () => initClient();
      document.body.appendChild(s);
    } else {
      initClient();
    }

    function initClient() {
      if (!(window as any).google) return;

      const client = (window as any).google.accounts.oauth2.initTokenClient({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID!,
        scope: 'https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/drive.readonly',
        callback: (tokenResponse: any) => {
          if (tokenResponse.access_token) {
            setAccessToken(tokenResponse.access_token);
            setSignedIn(true);
            setCurrentUser({ name: 'Google User' });
            localStorage.setItem(
              'baby_b_gapi_user',
              JSON.stringify({ signedIn: true, timestamp: Date.now() })
            );
          }
        },
      });

      setTokenClient(client);
    }
  }, []);

  // 🔹 Silent re-auth on reload
  useEffect(() => {
    const saved = localStorage.getItem('baby_b_gapi_user');
    if (saved) {
      const userData = JSON.parse(saved);
      if (userData.signedIn && tokenClient) {
        // request token silently (no consent screen)
        tokenClient.requestAccessToken({ prompt: '' });
      }
    }
  }, [tokenClient]);

  const signIn = useCallback(async () => {
    if (!tokenClient) throw new Error('GIS token client not initialized');
    // prompt user only the first time
    tokenClient.requestAccessToken({ prompt: 'consent' });
  }, [tokenClient]);

  const signOut = useCallback(async () => {
    if (accessToken) {
      try {
        await fetch(`https://oauth2.googleapis.com/revoke?token=${accessToken}`, {
          method: 'POST',
          headers: { 'Content-type': 'application/x-www-form-urlencoded' },
        });
      } catch (err) {
        console.warn('Token revoke failed', err);
      }
    }

    // 🔹 Remove from storage
    localStorage.removeItem('baby_b_gapi_user');

    // Reload app
    window.location.reload();
  }, [accessToken]);

  const getAccessToken = useCallback(async () => {
    if (!accessToken && tokenClient) {
      tokenClient.requestAccessToken({ prompt: '' });
    }
    return accessToken;
  }, [accessToken, tokenClient]);

  const fetchCsvFromDrive = useCallback(
    async (filePath: string = 'baby_b_tracker/babies_data.json') => {
      if (!accessToken) throw new Error('No access token available. Please sign in first.');

      const parts = filePath.split('/');
      const fileName = parts.pop()!;
      let parentId = 'root';

      // Traverse folders to get the correct parentId
      for (const folderName of parts) {
        const folderRes = await fetch(
          `https://www.googleapis.com/drive/v3/files?q=name='${folderName}' and '${parentId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false&fields=files(id,name)`,
          { headers: { Authorization: `Bearer ${accessToken}` } }
        );
        const folderData = await folderRes.json();
        if (!folderData.files || folderData.files.length === 0) {
          throw new Error(`Folder "${folderName}" not found in Drive.`);
        }
        parentId = folderData.files[0].id;
      }

      // Find the file in the final folder
      const fileRes = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=name='${fileName}' and '${parentId}' in parents and trashed=false&fields=files(id,name)`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const fileData = await fileRes.json();
      if (!fileData.files || fileData.files.length === 0) {
        throw new Error(`File "${fileName}" not found in Drive.`);
      }

      const fileId = fileData.files[0].id;

      // Fetch file content
      const jsonRes = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      const jsonText = await jsonRes.text();
      const json = JSON.parse(jsonText);

      return json;
    },
    [accessToken]
);

  return {
    gapiLoaded: !!tokenClient,
    isSignedIn,
    signIn,
    signOut,
    accessToken,
    getAccessToken,
    currentUser,
    fetchCsvFromDrive,
  };
}
