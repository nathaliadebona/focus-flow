const CACHE_NAME = 'focus-flow-v94';

const filesToCache = [
    'index.html',
    'styles/base.css',
    'styles/calendar.css',
    'styles/dashboard.css',
    'styles/header-footer.css',
    'styles/import.css',
    'styles/notes.css',
    'styles/responsive.css',
    'scripts/calendar.js',
    'scripts/dashboard.js',
    'scripts/import.js',
    'scripts/main.js',
    'scripts/notes.js',
    'scripts/theme.js',
    'scripts/utils.js',
    'manifest.json',
    'assets/icons/icon-192.png',
    'assets/icons/icon-512.png',
    'assets/icons/apple-touch-icon.png',
    'assets/splash/apple-splash-750-1334.png',
    'assets/splash/apple-splash-1242-2208.png',
    'assets/splash/apple-splash-1125-2436.png',
    'assets/splash/apple-splash-828-1792.png',
    'assets/splash/apple-splash-1242-2688.png',
    'assets/splash/apple-splash-1170-2532.png',
    'assets/splash/apple-splash-1284-2778.png',
    'assets/splash/apple-splash-1179-2556.png',
    'assets/splash/apple-splash-1290-2796.png',
    'assets/splash/apple-splash-1206-2622.png',
    'assets/splash/apple-splash-1320-2868.png',
    'fonts/inter-regular.woff2',
    'fonts/inter-medium.woff2',
    'fonts/poppins-bold.woff2'
];

self.addEventListener('install', (event) => {
    self.skipWaiting();
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => caches.delete(name))
            );
        }).then(() => {
            return self.clients.claim();
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