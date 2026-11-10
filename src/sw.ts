/// <reference lib="WebWorker" />
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import {
  NetworkFirst,
  CacheFirst,
  NetworkOnly,
} from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheableResponsePlugin } from 'workbox-cacheable-response';

declare let self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: Array<{ url: string; revision: string | null }>;
};

self.skipWaiting();
clientsClaim();

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// Anciens caches runtime remplacés (réponses opaques ou données périmées)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all(['cloudinary-images', 'events-api-cache'].map((name) => caches.delete(name)))
  );
});

// ── Navigation : app shell (SPA) ─────────────────────────────────────────────
registerRoute(
  new NavigationRoute(
    new NetworkFirst({
      cacheName: 'shell-cache',
      networkTimeoutSeconds: 5,
      plugins: [new CacheableResponsePlugin({ statuses: [0, 200] })],
    }),
    {
      denylist: [/^\/api\//, /^\/admin\//],
    }
  )
);

// ── API events & content publics (lecture seule) ─────────────────────────────
// Réseau d'abord (statut live, accès après achat) ; cache seulement hors-ligne.
// Les requêtes authentifiées ne sont jamais mises en cache.
registerRoute(
  ({ url, request }) =>
    request.method === 'GET' &&
    (url.pathname.startsWith('/api/events') || url.pathname.startsWith('/api/content')) &&
    !request.headers.has('Authorization'),
  new NetworkFirst({
    cacheName: 'events-api-v2',
    networkTimeoutSeconds: 4,
    plugins: [
      new CacheableResponsePlugin({ statuses: [200] }),
      new ExpirationPlugin({ maxEntries: 60, maxAgeSeconds: 60 * 60 }),
    ],
  })
);

// ── Streaming Mux → réseau uniquement, jamais en cache ───────────────────────
registerRoute(
  ({ url }) =>
    url.hostname.includes('mux.com') ||
    url.hostname.includes('stream.mux.com') ||
    url.hostname.includes('image.mux.com'),
  new NetworkOnly()
);

// ── Firebase → réseau uniquement ─────────────────────────────────────────────
registerRoute(
  ({ url }) =>
    url.hostname.includes('firebaseio.com') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('firestore.googleapis.com'),
  new NetworkOnly()
);

// ── Paiements / transactions → réseau uniquement ──────────────────────────────
registerRoute(
  ({ url }) => /\/(transactions|payments|payouts|wallets|checkout)\//.test(url.pathname),
  new NetworkOnly()
);

// ── Images Cloudinary ────────────────────────────────────────────────────────
registerRoute(
  ({ url, request }) => url.hostname === 'res.cloudinary.com' && request.mode === 'cors',
  new CacheFirst({
    cacheName: 'cloudinary-images-v2',
    plugins: [
      new CacheableResponsePlugin({ statuses: [200] }),
      new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 * 30 }),
    ],
  })
);

// ── Google Fonts ─────────────────────────────────────────────────────────────
registerRoute(
  ({ url }) => url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com',
  new CacheFirst({
    cacheName: 'google-fonts',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 }),
    ],
  })
);

// ── Fallback offline ─────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  if (event.request.mode !== 'navigate') return;
  event.respondWith(
    fetch(event.request).catch(() =>
      caches.match('/offline.html').then((r) => r ?? Response.error())
    )
  );
});

self.addEventListener('push', (event) => {
  const payload = event.data?.json?.() ?? {
    title: 'FEETI PLAY',
    message: event.data?.text?.() ?? 'Nouvelle notification',
  };

  const title = payload.title ?? 'FEETI PLAY';
  const options: NotificationOptions = {
    body: payload.message ?? payload.body ?? '',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    data: {
      url: payload.url ?? '/',
      notificationId: payload.id,
    },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url ?? '/';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      return self.clients.openWindow(targetUrl);
    })
  );
});
