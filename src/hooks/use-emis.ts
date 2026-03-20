"use client";

import { useState, useCallback } from "react";

// Extension ID will be known after publishing to Chrome Web Store.
// During development, use the unpacked extension ID from chrome://extensions.
// Set this in .env.local as NEXT_PUBLIC_EXTENSION_ID
const EXTENSION_ID = process.env.NEXT_PUBLIC_EXTENSION_ID || "";

interface EmisStatus {
  connected: boolean;
  lastSync: string | null;
}

/**
 * Hook to interact with the UniHub EMIS Chrome Extension.
 * Flow: Extension captures EMIS token → webapp reads it → sends to API → stored in httpOnly cookie.
 */
export function useEmis() {
  const [status, setStatus] = useState<EmisStatus>({ connected: false, lastSync: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasExtension = typeof chrome !== "undefined" && chrome.runtime?.sendMessage;

  /**
   * Check if the extension is installed and has a token.
   */
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

  /**
   * Request token from extension and send to our API.
   */
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
              setError("EMIS ტოკენი ვერ მოიძებნა. გახსენით emis.campus.edu.ge და შედით სისტემაში.");
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
                setError("ტოკენის შენახვა ვერ მოხერხდა");
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
   * Call an EMIS API endpoint through our proxy.
   */
  const callEmis = useCallback(async (endpoint: string, body?: object) => {
    const res = await fetch("/api/emis/proxy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ endpoint, method: body ? "POST" : "GET", body }),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: "Unknown error" }));
      throw new Error(err.error || `EMIS error ${res.status}`);
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
