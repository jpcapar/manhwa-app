/* ============================================================
   UI.JS — Handles UI interactions
   - Slide‑in panel open/close
   - Form handling
   - Button triggers
============================================================ */

/* -----------------------------
   ELEMENT REFERENCES
----------------------------- */

const panel = document.getElementById("addPanel");
const overlay = document.getElementById("panelOverlay");

const openTop = document.getElementById("openPanelTop");
const openSide = document.getElementById("openPanelSide");
const openFloat = document.getElementById("openPanelFloat");
const closePanel = document.getElementById("closePanel");

const saveBtn = document.getElementById("saveSeries");

const titleInput = document.getElementById("seriesTitle");
const coverInput = document.getElementById("seriesCover");
const baseURLInput = document.getElementById("seriesBaseURL");
const totalInput = document.getElementById("seriesTotal");
const startInput = document.getElementById("seriesStart");
const statusInput = document.getElementById("seriesStatus");

/* -----------------------------
   OPEN PANEL
----------------------------- */

function openAddPanel() {
    overlay.classList.remove("hidden");
    panel.classList.add("open");
}

openTop.onclick = openAddPanel;
openSide.onclick = openAddPanel;
openFloat.onclick = openAddPanel;

/* -----------------------------
   CLOSE PANEL
----------------------------- */

function closeAddPanel() {
    overlay.classList.add("hidden");
    panel.classList.remove("open");
}

closePanel.onclick = closeAddPanel;
overlay.onclick = closeAddPanel;

/* -----------------------------
   SAVE SERIES
----------------------------- */

saveBtn.onclick = async () => {
    const title = titleInput.value.trim();
    const baseURL = baseURLInput.value.trim();
    const totalChapters = totalInput.value.trim();
    const startChapter = startInput.value.trim();
    const status = statusInput.value;

    if (!title || !baseURL || !totalChapters) {
        alert("Please fill in all required fields.");
        return;
    }

    const coverFile = coverInput.files[0] || null;

    await app.addSeries({
        title,
        coverFile,
        baseURL,
        totalChapters,
        startChapter,
        status
    });

    closeAddPanel();

    // Clear form
    titleInput.value = "";
    baseURLInput.value = "";
    totalInput.value = "";
    startInput.value = "1";
    coverInput.value = "";

    app.loadLibrary();
};

/* -----------------------------
   INITIAL LOAD
----------------------------- */

document.addEventListener("DOMContentLoaded", () => {
    if (window.app && app.loadLibrary) {
        app.loadLibrary();
    }
});
