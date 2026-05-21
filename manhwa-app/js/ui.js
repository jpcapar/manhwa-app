const dropzone = document.getElementById("dropzone");

if (dropzone) {
    dropzone.addEventListener("dragover", e => {
        e.preventDefault();
        dropzone.classList.add("dragover");
    });

    dropzone.addEventListener("dragleave", () => {
        dropzone.classList.remove("dragover");
    });

    dropzone.addEventListener("drop", async e => {
        e.preventDefault();
        dropzone.classList.remove("dragover");

        const item = e.dataTransfer.items[0];

        if (item.kind === "string") {
            item.getAsString(async url => {
                await handleDroppedURL(url.trim());
            });
        }

        if (item.kind === "file") {
            const file = item.getAsFile();
            await handleDroppedImage(file);
        }
    });

    dropzone.addEventListener("click", async () => {
        const url = prompt("Paste a manhwa URL:");
        if (url) await handleDroppedURL(url.trim());
    });
}

async function handleDroppedURL(url) {
    debugLog({ event: "DROP_URL", url });

    if (!url.startsWith("http")) {
        alert("Invalid URL");
        return;
    }

    dropzone.textContent = "Scraping…";

    let meta;

    if (/webtoon\.xyz/i.test(url)) {
        debugLog({ event: "SCRAPER_SELECTED", type: "WebtoonXYZ" });
        meta = await scrapeWebtoonXYZSeries(url);
    } else {
        debugLog({ event: "SCRAPER_SELECTED", type: "Generic" });
        meta = await fetchMetadataFromURL(url);
    }

    debugLog({ event: "SCRAPER_META", meta });

    const series = addSeries({
        url,
        title: meta.title || "Untitled",
        image: meta.image,
        baseChapterURL: meta.baseChapterURL,
        totalChapters: meta.totalChapters || null,
        currentChapter: 1
    });

    debugLog({ event: "SERIES_ADDED", series });

    dropzone.textContent = "Drag & drop a manhwa link here";

    renderLibraryGrid();
    window.location.href = `series.html?id=${series.id}`;
}

async function handleDroppedImage(file) {
    if (!file.type.startsWith("image/")) {
        alert("Not an image");
        return;
    }

    const reader = new FileReader();
    reader.onload = () => {
        const imgURL = reader.result;

        const series = addSeries({
            url: "",
            title: "Untitled",
            image: imgURL,
            baseChapterURL: null
        });

        renderLibraryGrid();
        window.location.href = `series.html?id=${series.id}`;
    };

    reader.readAsDataURL(file);
}

document.addEventListener("DOMContentLoaded", () => {
    const navItems = document.querySelectorAll(".nav-item");
    navItems.forEach(item => {
        if (item.href && item.href === window.location.href) {
            item.classList.add("active");
        }
    });
});

function smoothScrollTo(y) {
    window.scrollTo({
        top: y,
        behavior: "smooth"
    });
}
