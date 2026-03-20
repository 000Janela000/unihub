// UniHub EMIS Connector — Content Script
// Runs on emis.campus.edu.ge pages
// Reads login data from EMIS and stores securely, then redirects to UniHub

const CHECK_INTERVAL = 2000;
const MAX_ATTEMPTS = 30;
const UNIHUB_URL = "https://unihub-edu.vercel.app/dashboard";

let attempts = 0;

function isValidJwt(token) {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  return parts.length === 3 && parts[0].length > 0 && parts[1].length > 0;
}

function getToken() {
  try {
    return localStorage.getItem("Student-Token");
  } catch {
    return null;
  }
}

function captureAndRedirect(token) {
  chrome.storage.local.set({
    emisToken: token,
    emisConnected: true,
    lastSync: new Date().toISOString(),
  }, () => {
    console.log("[UniHub] EMIS data synced");

    // Check if UniHub opened this tab (via extension popup or setup page)
    // If so, close this tab and focus UniHub
    chrome.storage.local.get(["returnToUniHub"], (data) => {
      if (data.returnToUniHub) {
        chrome.storage.local.remove("returnToUniHub");
        // Open UniHub and close this EMIS tab
        window.open(UNIHUB_URL, "_blank");
        setTimeout(() => window.close(), 500);
      }
    });
  });
}

function checkAndCapture() {
  if (attempts >= MAX_ATTEMPTS) return;
  attempts++;

  const token = getToken();
  if (token && isValidJwt(token)) {
    captureAndRedirect(token);
  } else if (attempts < MAX_ATTEMPTS) {
    setTimeout(checkAndCapture, CHECK_INTERVAL);
  }
}

// Start checking
checkAndCapture();

// Listen for storage changes (user logs in while page is open)
window.addEventListener("storage", (e) => {
  if (e.key === "Student-Token" && e.newValue && isValidJwt(e.newValue)) {
    captureAndRedirect(e.newValue);
  }
});

// Re-check when user returns to this EMIS tab
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible") {
    const token = getToken();
    if (token && isValidJwt(token)) {
      captureAndRedirect(token);
    }
  }
});
