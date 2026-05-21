/* ============================================================
   SERVICE WORKER — Safe, Auto-Updating, Never Breaks CSS/JS
============================================================ */

const CACHE_NAME = "manhwa-cache-v3"; // bump this when you deploy

const CORE_FILES = [
    "/",
    "/index.html",
    "/series.html",
    "/chapters.html",
    "/reader.html",
    "/manifest.json",
    "/css/styles.css",
    "/js/app.js",
    "/js/ui.js",
    "/js/debug.js"
];

/* -----------------------------
   INSTALL — Cache core files
----------------------------- */
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_FILES))
    );
    self.skipWaiting(); // activate immediately
});

/* -----------------------------
   ACTIVATE — Remove old caches
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
    self.clients.claim(); // take control immediately
});

/* -----------------------------
   FETCH — Network first
   Prevents stale CSS/JS forever
----------------------------- */
self.addEventListener("fetch", (event) => {
    event.respondWith(
        fetch(event.request)
            .then((response) => {
                // Save fresh version to cache
                const clone = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, clone);
                });
                return response;
            })
            .catch(() => {
                // Offline fallback
                return caches.match(event.request);
            })
    );
});
