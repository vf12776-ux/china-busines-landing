const CACHE_NAME = 'china-business-v3';
const urlsToCache = [
  '/china-busines-landing/',
  '/china-busines-landing/index.html',
  '/china-busines-landing/style.css',
  '/china-busines-landing/manifest.json',
  '/china-busines-landing/icons/icon-192.png',
  '/china-busines-landing/icons/icon-512.png',
  '/china-busines-landing/images/expert.jpg',
  '/china-busines-landing/images/logo.png'   // <-- добавили логотип
];
// остальные обработчики (install, fetch, activate) остаются без изменений

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache).catch(error => {
          console.error('Failed to cache some resources:', error);
        });
      })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});