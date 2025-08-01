self.addEventListener('install', e => {
  console.log('Service Worker: Installed');
});

self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request));
});
