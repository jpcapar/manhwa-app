function loadLibrary() {
    return JSON.parse(localStorage.getItem("manhwaLibrary") || "[]");
}

function saveLibrary() {
    localStorage.setItem("manhwaLibrary", JSON.stringify(library));
}

let library = loadLibrary();

function generateId() {
    return "m" + Math.random().toString(36).substr(2, 9);
}

function getSeriesById(id) {
    return library.find(s => s.id === id);
}

function addSeries({ url, title, image, baseChapterURL, totalChapters, currentChapter }) {
    const series = {
        id: generateId(),
        url,
        title: title || "Untitled",
        image: image || null,
        genres: "",
        status: "reading",
        baseChapterURL: baseChapterURL || null,
        totalChapters: totalChapters || null,
        currentChapter: currentChapter || 1,
        updatedAt: Date.now()
    };

    library.push(series);
    saveLibrary();
    return series;
}

function updateSeries(series, data) {
    Object.assign(series, data);
    series.updatedAt = Date.now();
    saveLibrary();
}

function deleteSeries(id) {
    library = library.filter(s => s.id !== id);
    saveLibrary();
}

function sortLibrary(mode) {
    if (mode === "az") {
        library.sort((a, b) => a.title.localeCompare(b.title));
    } else if (mode === "updated") {
        library.sort((a, b) => b.updatedAt - a.updatedAt);
    } else if (mode === "progress") {
        library.sort((a, b) => {
            const pa = a.totalChapters ? a.currentChapter / a.totalChapters : 0;
            const pb = b.totalChapters ? b.currentChapter / b.totalChapters : 0;
            return pb - pa;
        });
    }
    saveLibrary();
}

function searchLibrary(query) {
    query = query.toLowerCase();
    return library.filter(s => s.title.toLowerCase().includes(query));
}

function statusDotClass(status) {
    if (status === "completed") return "status-completed";
    if (status === "hold") return "status-hold";
    return "status-reading";
}

function statusText(status) {
    if (status === "completed") return "Completed";
    if (status === "hold") return "On Hold";
    return "Reading";
}

function getProgressPercent(series) {
    if (!series.totalChapters || !series.currentChapter) return 0;
    return Math.min(100, (series.currentChapter / series.totalChapters) * 100);
}

function updateSeriesProgressUI(series) {
    const fill = document.getElementById("seriesProgressFill");
    const text = document.getElementById("seriesProgressText");
    if (!fill || !text) return;

    const percent = getProgressPercent(series);
    fill.style.width = percent + "%";
    text.textContent = `Chapter ${series.currentChapter || 0} of ${series.totalChapters || "?"} (${percent.toFixed(1)}%)`;
}

function renderLibraryGrid() {
    const grid = document.getElementById("libraryGrid");
    if (!grid) return;

    grid.innerHTML = "";

    library.forEach(series => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <div class="card-delete">×</div>
            <img class="card-img" src="${series.image || "assets/default-cover.png"}">
            <div class="card-title">${series.title}</div>
        `;

        card.addEventListener("click", () => {
            window.location.href = `series.html?id=${series.id}`;
        });

        card.querySelector(".card-delete").onclick = (e) => {
            e.stopPropagation();
            if (confirm(`Delete "${series.title}"?`)) {
                deleteSeries(series.id);
                renderLibraryGrid();
            }
        };

        grid.appendChild(card);
    });
}

function exportLibrary() {
    const data = JSON.stringify(library, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "manhwa-library.json";
    a.click();

    URL.revokeObjectURL(url);
}

function importLibrary(jsonText) {
    try {
        const data = JSON.parse(jsonText);
        if (Array.isArray(data)) {
            library = data;
            saveLibrary();
            return true;
        }
    } catch (e) {
        return false;
    }
    return false;
}

document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("libraryGrid")) {
        renderLibraryGrid();

        const searchInput = document.getElementById("searchInput");
        if (searchInput) {
            searchInput.addEventListener("input", () => {
                const results = searchLibrary(searchInput.value);
                renderSearchResults(results);
            });
        }

        const sortSelect = document.getElementById("sortSelect");
        if (sortSelect) {
            sortSelect.addEventListener("change", () => {
                sortLibrary(sortSelect.value);
                renderLibraryGrid();
            });
        }
    }
});

function renderSearchResults(results) {
    const grid = document.getElementById("libraryGrid");
    if (!grid) return;

    grid.innerHTML = "";

    results.forEach(series => {
        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <div class="card-delete">×</div>
            <img class="card-img" src="${series.image || "assets/default-cover.png"}">
            <div class="card-title">${series.title}</div>
        `;

        card.addEventListener("click", () => {
            window.location.href = `series.html?id=${series.id}`;
        });

        card.querySelector(".card-delete").onclick = (e) => {
            e.stopPropagation();
            if (confirm(`Delete "${series.title}"?`)) {
                deleteSeries(series.id);
                renderSearchResults(searchLibrary(document.getElementById("searchInput").value));
            }
        };

        grid.appendChild(card);
    });
}
