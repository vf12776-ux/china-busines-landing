const CACHE_NAME = 'china-business-v1';
const urlsToCache = [
  '/',
  'index.html',
  'styles.css',
  'manifest.json',
  'icons/icon-192x192.png',  // хотя бы одна иконка
  // можно добавить шрифты, если они локальные (но Google Fonts кэшируются браузером)
];

// Установка service worker и кэширование ресурсов
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Перехват запросов и обслуживание из кэша, если есть
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // если есть в кэше, возвращаем
        }
        return fetch(event.request); // иначе идём в сеть
      })
  );
});

// Активация и удаление старых кэшей
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