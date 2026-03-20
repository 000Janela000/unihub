// UniHub EMIS Connector — Content Script
// Runs on emis.campus.edu.ge pages
// Reads Student-Token from EMIS localStorage and stores in chrome.storage

const CHECK_INTERVAL = 3000;
const MAX_ATTEMPTS = 20;

let attempts = 0;
let captured = false;

function getToken() {
  try {
    return localStorage.getItem("Student-Token");
  } catch {
    return null;
  }
}

function captureToken(token) {
  if (captured) return;
  captured = true;

  chrome.storage.local.set({
    emisToken: token,
    emisConnected: true,
    lastSync: new Date().toISOString(),
  });

  console.log("[UniHub] EMIS token captured");
}

function checkAndCapture() {
  if (captured || attempts >= MAX_ATTEMPTS) return;
  attempts++;

  const token = getToken();
  if (token) {
    captureToken(token);
  } else if (attempts < MAX_ATTEMPTS) {
    setTimeout(checkAndCapture, CHECK_INTERVAL);
  }
}

// Start checking
checkAndCapture();

// Listen for storage changes (user logs in while page is open)
window.addEventListener("storage", (e) => {
  if (e.key === "Student-Token" && e.newValue) {
    captureToken(e.newValue);
  }
});

// Listen for messages from UniHub pages requesting the token
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "GET_EMIS_TOKEN") {
    const token = getToken();
    sendResponse({ token });
  }
});
