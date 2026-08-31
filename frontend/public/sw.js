const VERSION = 'v1';
const STATIC_CACHE = `slapshot-static-${VERSION}`;
const PAGES_CACHE = `slapshot-pages-${VERSION}`;
const IMAGE_CACHE = `slapshot-images-${VERSION}`;
const MANAGED_CACHES = [STATIC_CACHE, PAGES_CACHE, IMAGE_CACHE];

const OFFLINE_URL = '/offline.html';
const PRECACHE_URLS = [OFFLINE_URL, '/icons/icon-192.png', '/icons/icon-512.png'];

const PAGES_CACHE_LIMIT = 30;
const IMAGE_CACHE_LIMIT = 60;

const isStaticAsset = (url) =>
  url.pathname.startsWith('/_next/static/') ||
  url.pathname.startsWith('/icons/') ||
  url.pathname === '/manifest.webmanifest';

const isImageAsset = (request, url) =>
  request.destination === 'image' || url.pathname.startsWith('/_next/image');

async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();

  if (keys.length <= maxEntries) return;

  await Promise.all(keys.slice(0, keys.length - maxEntries).map((key) => cache.delete(key)));
}

async function clearManagedCaches() {
  const keys = await caches.keys();
  await Promise.all(keys.filter((key) => key.startsWith('slapshot-')).map((key) => caches.delete(key)));
}

async function handleNavigation(request) {
  try {
    const response = await fetch(request);

    if (response && response.ok && response.type === 'basic') {
      const cache = await caches.open(PAGES_CACHE);
      await cache.put(request, response.clone());
      await trimCache(PAGES_CACHE, PAGES_CACHE_LIMIT);
    }

    return response;
  } catch {
    const cached = await caches.match(request, { ignoreSearch: true });
    if (cached) return cached;

    const offline = await caches.match(OFFLINE_URL);
    if (offline) return offline;

    return Response.error();
  }
}

async function handleCacheFirst(request, cacheName) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);

  if (response && response.ok) {
    const cache = await caches.open(cacheName);
    await cache.put(request, response.clone());
  }

  return response;
}

async function handleStaleWhileRevalidate(request) {
  const cache = await caches.open(IMAGE_CACHE);
  const cached = await cache.match(request);

  const networked = fetch(request)
    .then(async (response) => {
      if (response && response.ok) {
        await cache.put(request, response.clone());
        await trimCache(IMAGE_CACHE, IMAGE_CACHE_LIMIT);
      }
      return response;
    })
    .catch(() => cached);

  return cached || networked;
}

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS)));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();

      await Promise.all(
        keys
          .filter((key) => key.startsWith('slapshot-') && !MANAGED_CACHES.includes(key))
          .map((key) => caches.delete(key)),
      );

      await self.clients.claim();
    })(),
  );
});

self.addEventListener('message', (event) => {
  const type = event.data && event.data.type;

  if (type === 'SKIP_WAITING') {
    self.skipWaiting();
    return;
  }

  if (type === 'CLEAR_CACHES') {
    event.waitUntil(clearManagedCaches());
  }
});

self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/')) return;

  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request));
    return;
  }

  if (isStaticAsset(url)) {
    event.respondWith(handleCacheFirst(request, STATIC_CACHE));
    return;
  }

  if (isImageAsset(request, url)) {
    event.respondWith(handleStaleWhileRevalidate(request));
  }
});
