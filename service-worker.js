const CACHE_NAME = "manhwa-app-v1";
const ASSETS = [
  "index.html",
  "series.html",
  "chapters.html",
  "reader.html",
  "css/styles.css",
  "js/app.js",
  "js/ui.js",
  "js/autoDetect.js",
  "js/fetchMeta.js",
  "js/pwa.js",
  "js/debug.js",
  "assets/app-icon.png",
  "assets/splash-512.png",
  "assets/default-cover.png",
  "manifest.json"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) return caches.delete(key);
        })
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const url = event.request.url;

  if (url.includes("webtoon.xyz")) {
    event.respondWith(
      caches.open("chapters").then(async cache => {
        const cached = await cache.match(event.request);
        if (cached) return cached;

        try {
          const res = await fetch(event.request);
          cache.put(event.request, res.clone());
          return res;
        } catch (err) {
          return cached || Response.error();
        }
      })
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      return (
        response ||
        fetch(event.request).catch(() =>
          caches.match("index.html")
        )
      );
    })
  );
});
