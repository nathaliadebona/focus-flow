const CACHE_NAME = 'focus-flow-v3';

const filesToCache = [
    'index.html',
    'style.css',
    'script.js',
    'manifest.json',
    'assets/icons/icon-192.png',
    'assets/icons/icon-512.png',
    'assets/icons/apple-touch-icon.png',
    'fonts/inter-regular.woff2',
    'fonts/inter-medium.woff2',
    'fonts/poppins-bold.woff2'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cached) => {
            if (cached) {
                return cached
            } else {
                return fetch(event.request)
            };
        }).catch(() => {
            return new Response('', { status: 408})
        })
    );
});