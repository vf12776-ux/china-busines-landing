const CACHE_NAME = 'china-business-v1';
const urlsToCache = [
  '/',                // корень приложения (scope)
  'index.html',
  'styles.css',
  'manifest.json',
  'icons/icon-192.png',
  'icons/icon-512.png'
  // при необходимости добавьте другие важные файлы
];

// Установка service worker и кэширование ресурсов
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Используем cache.addAll, но не даём установке упасть из-за одной ошибки
        return cache.addAll(urlsToCache).catch(error => {
          console.error('Failed to cache some resources:', error);
          // Продолжаем установку, даже если некоторые ресурсы не закэшированы
        });
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