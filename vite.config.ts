import { defineConfig } from 'vite'
import path from 'path'
import fs from 'fs'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import type { Plugin } from 'vite'

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
