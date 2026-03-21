// UniHub EMIS Connector — Sync Script
// Runs on UniHub pages to push captured EMIS token to the webapp API
// This avoids needing EXTENSION_ID for cross-extension messaging

function syncTokenToApi() {
  chrome.storage.local.get(["emisToken", "emisConnected"], async (data) => {
    if (!data.emisToken || !data.emisConnected) return;

    // Save to localStorage for direct browser EMIS calls
    try {
      localStorage.setItem("emis_token", data.emisToken);
    } catch {}

    try {
      // Same-origin request — has NextAuth session cookies
      const res = await fetch("/api/emis/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: data.emisToken }),
      });

      if (res.ok) {
        console.log("[UniHub Extension] Token synced");
        chrome.storage.local.set({ tokenSyncedToApi: true });
      }
    } catch (err) {
      console.log("[UniHub Extension] API sync failed, will retry", err);
    }
  });
}

// Sync on load
syncTokenToApi();

// Sync when storage changes (token captured while UniHub is open)
chrome.storage.onChanged.addListener((changes) => {
  if (changes.emisToken || changes.emisConnected) {
    syncTokenToApi();
  }
});
