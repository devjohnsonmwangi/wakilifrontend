self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('wakili-cache').then((cache) => {
      return cache.addAll([
        '/',
        '/index.html',
        '/manifest.json',
        "https://wakilifrontend.vercel.app/wakililogo.png",
        "https://wakilifrontend.vercel.app/wakililogo.png"
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
