/* ============================================================
   APP.JS — Core Logic (Scraper‑Free Version)
   Handles:
   - Saving series
   - Loading library
   - Deleting series
   - Navigation to series/chapters/reader
============================================================ */

/* -----------------------------
   LOCAL STORAGE HELPERS
----------------------------- */

function getLibrary() {
    return JSON.parse(localStorage.getItem("manhwaLibrary") || "[]");
}

function saveLibrary(list) {
    localStorage.setItem("manhwaLibrary", JSON.stringify(list));
}

/* -----------------------------
   ADD NEW SERIES
----------------------------- */

async function addSeries(data) {
    const library = getLibrary();

    // Convert cover image to Base64
    let coverBase64 = "";
    if (data.coverFile) {
        coverBase64 = await fileToBase64(data.coverFile);
    }

    const newSeries = {
        id: Date.now(),
        title: data.title,
        cover: coverBase64,
        baseURL: data.baseURL,
        totalChapters: Number(data.totalChapters),
        startChapter: Number(data.startChapter),
        status: data.status,
        progress: data.startChapter
    };

    library.push(newSeries);
    saveLibrary(library);
    loadLibrary();
}

/* -----------------------------
   FILE → BASE64
----------------------------- */

function fileToBase64(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(file);
    });
}

/* -----------------------------
   LOAD LIBRARY GRID
----------------------------- */

function loadLibrary() {
    const library = getLibrary();
    const grid = document.getElementById("libraryGrid");
    grid.innerHTML = "";

    if (library.length === 0) {
        grid.innerHTML = `<p style="opacity:0.6;">No series added yet.</p>`;
        return;
    }

    library.forEach(series => {
        const card = document.createElement("div");
        card.className = "card";
        card.onclick = () => openSeries(series.id);

        card.innerHTML = `
            <img src="${series.cover || 'assets/default-cover.png'}" />
            <div class="card-title">${series.title}</div>
        `;

        grid.appendChild(card);
    });
}

/* -----------------------------
   OPEN SERIES PAGE
----------------------------- */

function openSeries(id) {
    localStorage.setItem("currentSeries", id);
    window.location.href = "series.html";
}

/* -----------------------------
   DELETE SERIES
----------------------------- */

function deleteSeries(id) {
    let library = getLibrary();
    library = library.filter(s => s.id !== id);
    saveLibrary(library);
    loadLibrary();
}

/* -----------------------------
   GET CURRENT SERIES
----------------------------- */

function getCurrentSeries() {
    const id = Number(localStorage.getItem("currentSeries"));
    const library = getLibrary();
    return library.find(s => s.id === id);
}

/* -----------------------------
   SAVE PROGRESS
----------------------------- */

function updateProgress(seriesId, chapter) {
    const library = getLibrary();
    const s = library.find(x => x.id === seriesId);
    if (!s) return;

    s.progress = chapter;
    saveLibrary(library);
}

/* -----------------------------
   BUILD CHAPTER URL
----------------------------- */

function buildChapterURL(series, chapterNumber) {
    return `${series.baseURL}${chapterNumber}/`;
}

/* -----------------------------
   EXPORT FUNCTIONS
----------------------------- */

window.app = {
    addSeries,
    loadLibrary,
    deleteSeries,
    getCurrentSeries,
    updateProgress,
    buildChapterURL
};
