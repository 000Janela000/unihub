"use client";

import { useState, useCallback } from "react";

// Chrome Web Store extension ID — set NEXT_PUBLIC_EXTENSION_ID in Vercel env vars
const EXTENSION_ID = process.env.NEXT_PUBLIC_EXTENSION_ID || "";
const EMIS_BASE = "https://emis.campus.edu.ge";

interface EmisStatus {
  connected: boolean;
  lastSync: string | null;
}

/**
 * Get the EMIS token from the extension.
 * Returns null if extension not available or no token.
 */
function getTokenFromExtension(): Promise<string | null> {
  if (!EXTENSION_ID || typeof chrome === "undefined" || !chrome.runtime?.sendMessage) {
    return Promise.resolve(null);
  }

  return new Promise((resolve) => {
    try {
      chrome.runtime.sendMessage(
        EXTENSION_ID,
        { type: "GET_EMIS_TOKEN" },
        (response) => {
          if (chrome.runtime.lastError || !response?.token) {
            resolve(null);
            return;
          }
          resolve(response.token);
        }
      );
    } catch {
      resolve(null);
    }
  });
}

export function useEmis() {
  const [status, setStatus] = useState<EmisStatus>({ connected: false, lastSync: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasExtension = typeof chrome !== "undefined" && chrome.runtime?.sendMessage;

  const checkExtension = useCallback(async (): Promise<boolean> => {
    if (!EXTENSION_ID || !hasExtension) return false;

    return new Promise((resolve) => {
      try {
        chrome.runtime.sendMessage(
          EXTENSION_ID,
          { type: "GET_EMIS_TOKEN" },
          (response) => {
            if (chrome.runtime.lastError || !response) {
              resolve(false);
              return;
            }
            setStatus({
              connected: response.connected,
              lastSync: response.lastSync,
            });
            resolve(response.connected);
          }
        );
      } catch {
        resolve(false);
      }
    });
  }, [hasExtension]);

  const syncToken = useCallback(async (): Promise<boolean> => {
    if (!EXTENSION_ID || !hasExtension) {
      setError("Chrome გაფართოება ვერ მოიძებნა");
      return false;
    }

    setLoading(true);
    setError(null);

    return new Promise((resolve) => {
      try {
        chrome.runtime.sendMessage(
          EXTENSION_ID,
          { type: "GET_EMIS_TOKEN" },
          async (response) => {
            if (chrome.runtime.lastError || !response?.token) {
              setError("EMIS-თან კავშირი ვერ მოიძებნა. გახსენით emis.campus.edu.ge და შედით სისტემაში.");
              setLoading(false);
              resolve(false);
              return;
            }

            try {
              const res = await fetch("/api/emis/token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: response.token }),
              });

              if (res.ok) {
                setStatus({ connected: true, lastSync: new Date().toISOString() });
                setLoading(false);
                resolve(true);
              } else {
                setError("კავშირის შენახვა ვერ მოხერხდა");
                setLoading(false);
                resolve(false);
              }
            } catch {
              setError("სერვერთან კავშირის შეცდომა");
              setLoading(false);
              resolve(false);
            }
          }
        );
      } catch {
        setError("გაფართოებასთან კავშირის შეცდომა");
        setLoading(false);
        resolve(false);
      }
    });
  }, [hasExtension]);

  /**
   * Call an EMIS API endpoint directly from the browser.
   * EMIS has Access-Control-Allow-Origin: * so CORS is fine.
   * Gets token from extension, calls EMIS directly — no server proxy needed.
   */
  const callEmis = useCallback(async (endpoint: string, body?: object) => {
    const token = await getTokenFromExtension();

    if (!token) {
      // Fall back: check if we have a server-side cookie and use proxy
      const tokenCheck = await fetch("/api/emis/token").then(r => r.json()).catch(() => ({ connected: false }));
      if (tokenCheck.connected) {
        // Use server proxy as fallback
        const res = await fetch("/api/emis/proxy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ endpoint, method: body !== undefined ? "POST" : "GET", body }),
        });
        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: "Unknown error" }));
          throw new Error(err.error || `EMIS error ${res.status}`);
        }
        return res.json();
      }

      setStatus({ connected: false, lastSync: null });
      throw new Error("EMIS not connected");
    }

    // Direct browser call to EMIS
    const emisUrl = `${EMIS_BASE}${endpoint}`;
    const method = body !== undefined ? "POST" : "GET";
    const fetchOptions: RequestInit = {
      method,
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    if (method === "POST") {
      fetchOptions.body = JSON.stringify(body || {});
    }

    const res = await fetch(emisUrl, fetchOptions);

    if (!res.ok) {
      if (res.status === 401) {
        setError("EMIS სესია ამოიწურა. გახსენით emis.campus.edu.ge თავიდან შესასვლელად.");
        setStatus({ connected: false, lastSync: null });
      }
      throw new Error(`EMIS error ${res.status}`);
    }

    return res.json();
  }, []);

  return {
    status,
    loading,
    error,
    hasExtension: !!hasExtension && !!EXTENSION_ID,
    checkExtension,
    syncToken,
    callEmis,
  };
}
