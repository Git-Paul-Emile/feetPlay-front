/// <reference lib="WebWorker" />
import { cleanupOutdatedCaches, precacheAndRoute } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import {
  NetworkFirst,
  CacheFirst,
  StaleWhileRevalidate,
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

// ── API events & content (read-only) ─────────────────────────────────────────
registerRoute(
  ({ url }) =>
    url.pathname.startsWith('/api/events') ||
    url.pathname.startsWith('/api/content') ||
    (url.hostname === 'localhost' && url.port === '8001' && url.pathname.startsWith('/api/events')),
  new StaleWhileRevalidate({
    cacheName: 'events-api-cache',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
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
  ({ url }) => url.hostname === 'res.cloudinary.com',
  new CacheFirst({
    cacheName: 'cloudinary-images',
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
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
