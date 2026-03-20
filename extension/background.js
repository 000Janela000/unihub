// UniHub EMIS Connector — Background Service Worker
// Handles messages from UniHub webapp requesting the EMIS token

chrome.runtime.onMessageExternal.addListener(
  (message, sender, sendResponse) => {
    if (message.type === "GET_EMIS_TOKEN") {
      chrome.storage.local.get(["emisToken", "emisConnected", "lastSync"], (data) => {
        sendResponse({
          token: data.emisToken || null,
          connected: !!data.emisConnected,
          lastSync: data.lastSync || null,
        });
      });
      return true; // Keep channel open for async response
    }

    if (message.type === "CLEAR_EMIS_TOKEN") {
      chrome.storage.local.remove(["emisToken", "emisConnected", "lastSync"], () => {
        sendResponse({ ok: true });
      });
      return true;
    }
  }
);
