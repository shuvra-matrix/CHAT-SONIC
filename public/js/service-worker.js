const CACHE_NAME = "sw-cache-example";
const toCache = [
  "/",
  "/css/style.css",
  "/images/avatar.jpg",
  "/images/d4.jpg",
  "/images/logo.png",
  "/images/dalhe.jpg",
  "/images/chat.jpg",
  "/js/script.js",
  "/js/status.js",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {
        return cache.addAll(toCache);
      })
      .then(self.skipWaiting())
      .catch((err) => {
        console.log(err);
      })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    fetch(event.request).catch(() => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request);
      });
    })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches
      .keys()
      .then((keyList) => {
        return Promise.all(
          keyList.map((key) => {
            if (key !== CACHE_NAME) {
              console.log("[ServiceWorker] Removing old cache", key);
              return caches.delete(key);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});
