async function autoDetectTotalChapters(baseURL) {
    if (!baseURL) return 0;

    let chapter = 1;

    while (true) {
        const url = baseURL + chapter;

        try {
            const res = await fetch(url, { method: "HEAD" });
            if (!res.ok) break;
        } catch (err) {
            break;
        }

        chapter++;
    }

    return chapter - 1;
}
