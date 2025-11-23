import { useState, useEffect, useCallback, useRef } from "react";

export default function useGoogleAPI() {
  const [accessToken, setAccessToken] = useState<string | undefined>();
  const [isSignedIn, setSignedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [tokenClient, setTokenClient] = useState<any>(null);
  const scriptLoaded = useRef(false);

  const STORAGE_KEY = "baby_b_gapi_auth";

  // In-memory Drive ID cache
  const idCache = useRef<Map<string, string>>(new Map());

  // ---------------------------------------------------------------------
  // Load GIS script once
  // ---------------------------------------------------------------------
  useEffect(() => {
    if (scriptLoaded.current) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      scriptLoaded.current = true;
      initGoogleClients();
    };

    document.body.appendChild(script);
  }, []);

  // ---------------------------------------------------------------------
  // Initialize GIS clients (accounts.id + tokenClient)
  // ---------------------------------------------------------------------
  const initGoogleClients = useCallback(() => {
    const google = (window as any).google;
    if (!google?.accounts) return;

    // Restore cached token immediately if valid
    const saved = localStorage.getItem(STORAGE_KEY);
    let restored = false;

    if (saved) {
      const { token, expiresAt } = JSON.parse(saved);
      if (token && Date.now() < expiresAt) {
        setAccessToken(token);
        setSignedIn(true);
        setCurrentUser({ name: "Google User" });
        restored = true;
      }
    }

    // Token client (can request access tokens)
    const client = google.accounts.oauth2.initTokenClient({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID!,
      scope:
        "https://www.googleapis.com/auth/drive https://www.googleapis.com/auth/drive.readonly",
      callback: (tokenResponse: any) => {
        if (!tokenResponse?.access_token) return;

        const expiresAt =
          Date.now() + (tokenResponse.expires_in || 3600) * 1000;

        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ token: tokenResponse.access_token, expiresAt }),
        );

        setAccessToken(tokenResponse.access_token);
        setSignedIn(true);
        setCurrentUser({ name: "Google User" });
      },
    });

    setTokenClient(client);

    // iOS auto-login magic:
    // `accounts.id.initialize + prompt` allows silent refresh on iOS
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID!,
      auto_select: true,
      callback: () => {
        // Once Google confirms identity, silent token request is now allowed
        client.requestAccessToken({ prompt: "" });
      },
    });

    // Only call `prompt()` if NOT already restored
    if (!restored) {
      google.accounts.id.prompt();
    }
  }, []);

  // ---------------------------------------------------------------------
  // Sign In (user initiated)
  // ---------------------------------------------------------------------
  const signIn = useCallback(() => {
    if (!tokenClient) return;
    tokenClient.requestAccessToken({ prompt: "consent" });
  }, [tokenClient]);

  // ---------------------------------------------------------------------
  // Sign Out
  // ---------------------------------------------------------------------
  const signOut = useCallback(async () => {
    if (accessToken) {
      try {
        await fetch(
          `https://oauth2.googleapis.com/revoke?token=${accessToken}`,
          {
            method: "POST",
            headers: { "Content-type": "application/x-www-form-urlencoded" },
          },
        );
      } catch {}
    }

    localStorage.removeItem(STORAGE_KEY);
    setAccessToken(undefined);
    setSignedIn(false);
    setCurrentUser(null);
    window.location.reload();
  }, [accessToken]);

  // ---------------------------------------------------------------------
  // Get Access Token (auto-refresh)
  // ---------------------------------------------------------------------
  const getAccessToken = useCallback(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const { token, expiresAt } = JSON.parse(saved);
      if (token && Date.now() < expiresAt) return token;
    }

    // iOS-safe silent refresh
    if (tokenClient) {
      tokenClient.requestAccessToken({ prompt: "" });
    }

    return accessToken;
  }, [accessToken, tokenClient]);

  // ---------------------------------------------------------------------
  // Drive helpers (unchanged)
  // ---------------------------------------------------------------------
  const resolvePath = useCallback(async (filePath: string, createMissing = false) => {
    if (!accessToken) throw new Error("No access token. Please sign in first.");

    const parts = filePath.split("/");
    const fileName = parts.pop()!;
    let parentId: string = "root";

    for (const folderName of parts) {
      const cacheKey = `${parentId}/${folderName}`;
      if (idCache.current.has(cacheKey)) {
        parentId = idCache.current.get(cacheKey)!;
        continue;
      }

      const folderRes = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false and ('${parentId}' in parents or sharedWithMe)&fields=files(id,name)`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );

      const data = await folderRes.json();
      if (data.files?.length) {
        parentId = data.files[0].id;
        idCache.current.set(cacheKey, parentId);
        continue;
      }

      if (createMissing) {
        const createRes = await fetch(
          "https://www.googleapis.com/drive/v3/files",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              name: folderName,
              mimeType: "application/vnd.google-apps.folder",
              parents: [parentId],
            }),
          },
        );

        const created = await createRes.json();
        parentId = created.id;
        idCache.current.set(cacheKey, parentId);
        continue;
      }

      throw new Error(`Folder "${folderName}" not found.`);
    }

    const fileCacheKey = `${parentId}/${fileName}`;
    if (idCache.current.has(fileCacheKey)) {
      return {
        parentId,
        fileName,
        fileId: idCache.current.get(fileCacheKey)!,
      };
    }

    const fileRes = await fetch(
      `https://www.googleapis.com/drive/v3/files?q=name='${fileName}' and trashed=false and ('${parentId}' in parents or sharedWithMe)&fields=files(id,name)`,
      { headers: { Authorization: `Bearer ${accessToken}` } },
    );

    const fileData = await fileRes.json();
    if (fileData.files?.length) {
      const fileId = fileData.files[0].id;
      idCache.current.set(fileCacheKey, fileId);
      return { parentId, fileName, fileId };
    }

    return { parentId, fileName, fileId: null };
  }, [accessToken]);

  const fetchJsonFromDrive = useCallback(
    async (filePath = "baby_b_tracker/babies_data.json") => {
      const { fileId } = await resolvePath(filePath);
      if (!fileId) throw new Error(`File "${filePath}" not found.`);

      const res = await fetch(
        `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`,
        { headers: { Authorization: `Bearer ${accessToken}` } },
      );

      return res.json();
    },
    [accessToken, resolvePath],
  );

  const uploadJsonToDrive = useCallback(
    async (data: any, filePath = "baby_b_tracker/babies_data.json") => {
      const { parentId, fileName, fileId } = await resolvePath(filePath, true);
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });

      if (fileId) {
        const res = await fetch(
          `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=media`,
          {
            method: "PATCH",
            headers: { Authorization: `Bearer ${accessToken}` },
            body: blob,
          },
        );

        if (!res.ok) throw new Error("Failed to update JSON.");
        return { updated: true, fileId };
      }

      const metadata = { name: fileName, parents: [parentId] };
      const form = new FormData();
      form.append(
        "metadata",
        new Blob([JSON.stringify(metadata)], { type: "application/json" }),
      );
      form.append("file", blob);

      const res = await fetch(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${accessToken}` },
          body: form,
        },
      );

      const created = await res.json();
      idCache.current.set(`${parentId}/${fileName}`, created.id);

      return { created: true, fileId: created.id };
    },
    [accessToken, resolvePath],
  );

  return {
    gapiLoaded: !!tokenClient,
    isSignedIn,
    signIn,
    signOut,
    accessToken,
    getAccessToken,
    currentUser,
    fetchJsonFromDrive,
    uploadJsonToDrive,
  };
}
