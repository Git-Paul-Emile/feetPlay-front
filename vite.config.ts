import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'
import { webcrypto } from 'crypto'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'
import type { Plugin } from 'vite'

// Polyfill required by serialize-javascript (workbox dep) in Node 18 CJS contexts
if (typeof (globalThis as any).crypto === 'undefined') {
  (globalThis as any).crypto = webcrypto
}

const FRONTEND_PORT = 5173

// Plugin qui resout les imports figma:asset/ vers les fichiers locaux dans src/assets/
// Si le fichier n'existe pas, retourne un PNG transparent 1x1 en fallback
function figmaAssetsPlugin(): Plugin {
  const assetsDir = path.resolve(__dirname, './src/assets')
  // PNG transparent 1x1 en base64
  const PLACEHOLDER =
    'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='

  return {
    name: 'figma-assets',
    resolveId(id: string) {
      if (!id.startsWith('figma:asset/')) return
      const filename = id.slice('figma:asset/'.length)
      const localPath = path.join(assetsDir, filename)
      if (fs.existsSync(localPath)) {
        return localPath
      }
      return `\0figma-placeholder:${filename}`
    },
    load(id: string) {
      if (!id.startsWith('\0figma-placeholder:')) return
      return `export default '${PLACEHOLDER}'`
    },
  }
}

export default defineConfig(() => ({
  plugins: [
    react(),
    tailwindcss(),
    figmaAssetsPlugin(),
    VitePWA({
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      registerType: 'prompt',
      injectRegister: 'auto',
      includeAssets: ['icons/*.png', 'offline.html'],

      manifest: {
        name: 'FeetiPlay — Streaming & Live Ticketing',
        short_name: 'FeetiPlay',
        description: 'Watch live events, buy tickets, and enjoy replays with FeetiPlay.',
        theme_color: '#CDFF71',
        background_color: '#080808',
        display: 'standalone',
        display_override: ['window-controls-overlay', 'standalone'],
        start_url: '/',
        scope: '/',
        lang: 'fr',
        orientation: 'portrait-primary',
        categories: ['entertainment', 'lifestyle'],
        icons: [
          { src: '/icons/icon-72.png',  sizes: '72x72',   type: 'image/png' },
          { src: '/icons/icon-96.png',  sizes: '96x96',   type: 'image/png' },
          { src: '/icons/icon-128.png', sizes: '128x128', type: 'image/png' },
          { src: '/icons/icon-144.png', sizes: '144x144', type: 'image/png' },
          { src: '/icons/icon-152.png', sizes: '152x152', type: 'image/png' },
          { src: '/icons/icon-180.png', sizes: '180x180', type: 'image/png' },
          { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icons/icon-384.png', sizes: '384x384', type: 'image/png' },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
        shortcuts: [
          {
            name: 'Live',
            short_name: 'Live',
            url: '/live',
            icons: [{ src: '/icons/icon-96.png', sizes: '96x96' }],
          },
          {
            name: 'Events',
            short_name: 'Events',
            url: '/events',
            icons: [{ src: '/icons/icon-96.png', sizes: '96x96' }],
          },
          {
            name: 'My Tickets',
            short_name: 'Tickets',
            url: '/dashboard/tickets',
            icons: [{ src: '/icons/icon-96.png', sizes: '96x96' }],
          },
        ],
        screenshots: [],
      },

      injectManifest: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        maximumFileSizeToCacheInBytes: 2 * 1024 * 1024,
      },

      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  assetsInclude: ['**/*.svg', '**/*.csv'],
  server: {
    port: FRONTEND_PORT,
    strictPort: true,
    open: true,
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
    },
  },
}))
