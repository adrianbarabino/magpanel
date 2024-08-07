// service-worker.js
const CACHE_NAME = 'version-1';
const urlsToCache = [
    'index.html',
    '/build/bundle.css',
    '/font-awesome.css',
    '/webfonts/fa-solid-900.woff2',
    '/webfonts/fa-solid-900.ttf',
    'https://fonts.googleapis.com/css?family=Poppins:300,400,500,600,700,800,900',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
    'https://unpkg.com/leaflet/dist/leaflet.css',
    'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap',
    'https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css',
    '/bootstrap.min.css',
    '/global.css',
    '/build/bundle.js',
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
    '/icons/favicon.ico',
    '/icons/apple-touch-icon.png',
    '/icons/favicon-32x32.png',
    '/icons/favicon-16x16.png',
    '/icons/android-chrome-192x192.png',
    '/icons/android-chrome-512x512.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});
self.addEventListener('sync', event => {
    if (event.tag === 'sync-pending-operations') {
        event.waitUntil(
            // Función que manejará la sincronización de datos pendientes
            syncDataWithServer()
        );
    }
});

async function syncDataWithServer() {
    const db = await openDB('MagPanel', 1);
    const tx = db.transaction('pendingRequests', 'readonly');
    const pendingRequests = await tx.store.getAll();

    for (const request of pendingRequests) {
        const response = await fetch(request.url, {
            method: request.method,
            headers: request.headers,
            body: request.body
        });
        if (response.ok) {
            // Eliminar la solicitud pendiente de IndexedDB si se procesa correctamente
            const deleteTx = db.transaction('pendingRequests', 'readwrite');
            await deleteTx.store.delete(request.id);
            await deleteTx.done;
        }
    }
}

self.addEventListener('fetch', (event) => {
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request).then(response => {
                if (response) {
                    return response;
                }
            });
        })
    );
});

self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
