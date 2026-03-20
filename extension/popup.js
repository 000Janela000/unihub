// UniHub EMIS Connector — Popup Script

function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    if (!payload.exp) return false;
    return payload.exp * 1000 < Date.now() + 5 * 60 * 1000;
  } catch {
    return false;
  }
}

function getStudentInfo(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      name: payload.name || "",
      firstNameEng: payload.firstNameEng || "",
      lastNameEng: payload.lastNameEng || "",
      group: payload.view?.gpa ? `GPA: ${payload.view.gpa}` : "",
    };
  } catch {
    return null;
  }
}

function showView(viewId) {
  document.getElementById("connected-view").classList.add("hidden");
  document.getElementById("expired-view").classList.add("hidden");
  document.getElementById("waiting-view").classList.add("hidden");
  document.getElementById(viewId).classList.remove("hidden");
}

// Set returnToUniHub flag when user clicks EMIS login buttons
function setupEmisLinks() {
  const btns = document.querySelectorAll("#emis-login-btn, #emis-refresh-btn");
  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      chrome.storage.local.set({ returnToUniHub: true });
    });
  });
}

// Load state
chrome.storage.local.get(["emisToken", "emisConnected", "lastSync"], (data) => {
  if (!data.emisToken || !data.emisConnected) {
    showView("waiting-view");
    setupEmisLinks();
    return;
  }

  // Check if expired
  if (isTokenExpired(data.emisToken)) {
    showView("expired-view");
    setupEmisLinks();
    return;
  }

  // Connected
  showView("connected-view");

  // Show last sync time
  if (data.lastSync) {
    const date = new Date(data.lastSync);
    const formatted = date.toLocaleString("ka-GE", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
    document.getElementById("sync-time").textContent = formatted;
  }

  // Show student info from JWT
  const student = getStudentInfo(data.emisToken);
  if (student && student.name) {
    const card = document.getElementById("student-card");
    card.classList.remove("hidden");

    document.getElementById("student-name").textContent = student.name;
    document.getElementById("student-meta").textContent = student.group;

    // Initials
    const initials = student.name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2);
    document.getElementById("student-initials").textContent = initials || "?";
  }

  setupEmisLinks();
});
