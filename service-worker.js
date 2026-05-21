/* ============================================================
   SERVICE WORKER — Clean PWA Cache
   Works with GitHub Pages
============================================================ */

const CACHE_NAME = "manhwa-cache-v1";

const CORE_FILES = [
    "index.html",
    "series.html",
    "chapters.html",
    "reader.html",
    "manifest.json",
    "css/styles.css",
    "js/app.js",
    "js/ui.js",
    "js/debug.js"
];

/* -----------------------------
   INSTALL — Cache Core Files
----------------------------- */
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(CORE_FILES);
        })
    );
    self.skipWaiting();
});

/* -----------------------------
   ACTIVATE — Clear Old Caches
----------------------------- */
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((key) => key !== CACHE_NAME)
                    .map((key) => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});

/* -----------------------------
   FETCH — Cache First Strategy
----------------------------- */
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((cached) => {
            return (
                cached ||
                fetch(event.request).catch(() =>
                    caches.match("index.html")
                )
            );
        })
    );
});
