// Read connection status from extension storage
chrome.storage.local.get(["emisConnected", "lastSync"], (data) => {
  const statusEl = document.getElementById("status");
  const metaEl = document.getElementById("meta");

  if (data.emisConnected) {
    statusEl.className = "status connected";
    statusEl.innerHTML = '<div class="dot green"></div><span>დაკავშირებულია</span>';

    if (data.lastSync) {
      const date = new Date(data.lastSync);
      const formatted = date.toLocaleString("ka-GE", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      });
      metaEl.textContent = `ბოლო სინქრონიზაცია: ${formatted}`;
    }
  }
});
