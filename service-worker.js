self.addEventListener("install", e => {
  e.waitUntil(
    caches.open("weather-ui").then(c =>
      c.addAll(["./", "index.html", "style.css", "script.js"])
    )
  );
});

self.addEventListener("fetch", e => {
  if (e.request.url.includes("api")) return;
  e.respondWith(fetch(e.request).catch(() => caches.match(e.request)));
});
