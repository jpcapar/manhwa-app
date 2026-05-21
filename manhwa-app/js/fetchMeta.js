async function fetchHTML(url) {
    try {
        const res = await fetch(url);
        return await res.text();
    } catch (err) {
        debugLog({ event: "FETCH_HTML_ERROR", url, error: String(err) });
        return null;
    }
}

function extractTitle(html) {
    const match = html.match(/<title>(.*?)<\/title>/i);
    if (!match) return null;

    let title = match[1]
        .replace(/[\n\r]/g, "")
        .replace(/–/g, "-")
        .trim();

    title = title.replace(/[-|•].*$/i, "").trim();

    return title || null;
}

function extractCover(html) {
    const matches = [...html.matchAll(/<img[^>]+src="([^"]+)"/g)];
    if (!matches.length) return null;

    const candidates = matches.map(m => m[1]).filter(src =>
        src.match(/cover|series|manga|manhwa|thumbnail|wp-content/i)
    );

    return candidates[0] || matches[0][1] || null;
}

function detectBaseChapterURL(url) {
    const match = url.match(/(.+?chapter[-_/])(\d+)/i);
    if (!match) return null;
    return match[1];
}

function cleanSeriesURL(url) {
    url = url.replace(/chapter[-_/]\d+/i, "");
    url = url.replace(/\/+$/, "");
    return url;
}

async function fetchMetadataFromURL(url) {
    debugLog({ event: "GENERIC_SCRAPER_START", url });

    const html = await fetchHTML(url);
    if (!html) {
        const fallback = {
            title: null,
            image: null,
            baseChapterURL: detectBaseChapterURL(url),
            cleanURL: cleanSeriesURL(url)
        };
        debugLog({ event: "GENERIC_SCRAPER_RESULT", result: fallback });
        return fallback;
    }

    const title = extractTitle(html);
    const image = extractCover(html);
    const baseChapterURL = detectBaseChapterURL(url);
    const cleanURL = cleanSeriesURL(url);

    const result = {
        title,
        image,
        baseChapterURL,
        cleanURL
    };

    debugLog({ event: "GENERIC_SCRAPER_RESULT", result });

    return result;
}

// WebtoonXYZ series scraper
async function scrapeWebtoonXYZSeries(url) {
    debugLog({ event: "SCRAPER_START", url });

    const proxy = "https://api.allorigins.win/raw?url=";
    const res = await fetch(proxy + encodeURIComponent(url));
    const html = await res.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    const title = doc.querySelector("h1")?.textContent?.trim() || null;
    const cover = doc.querySelector(".thumb img")?.src || null;

    const links = [...doc.querySelectorAll(".clstyle a")];
    const chapterNumbers = [];

    links.forEach(a => {
        const match = a.href.match(/chapter-(\d+)/i);
        if (match) chapterNumbers.push(parseInt(match[1]));
    });

    const totalChapters = chapterNumbers.length
        ? Math.max(...chapterNumbers)
        : null;

    let baseChapterURL = null;
    if (links.length > 0) {
        const sample = links[0].href;
        const m = sample.match(/(.+chapter-)\d+/i);
        if (m) baseChapterURL = m[1];
    }

    const result = {
        scraper: "WebtoonXYZ",
        url,
        title,
        image: cover,
        totalChapters,
        baseChapterURL,
        chapterCountDetected: chapterNumbers.length
    };

    debugLog({ event: "SCRAPER_RESULT", result });

    return result;
}
