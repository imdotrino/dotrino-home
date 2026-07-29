import { defineConfig, type Plugin } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'
import { execSync } from 'node:child_process'

// <meta name="commit"> con el hash del commit del build: permite ver a simple
// vista (Ver código fuente / document.querySelector) qué versión sirve el
// dominio — clave para diagnosticar cachés viejas. Normado en CONVENCIONES-APPS.
// El meta viaja también a las páginas de rutas (que-es.html), que scripts/
// gen-routes.mjs deriva del index.html ya construido.
function commitMeta (): Plugin {
  let hash = 'dev'
  try { hash = execSync('git rev-parse --short HEAD').toString().trim() } catch { /* sin git */ }
  return {
    name: 'commit-meta',
    transformIndexHtml: (html) =>
      html.replace('</head>', `    <meta name="commit" content="${hash}" />\n</head>`),
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    commitMeta(),
    vue({
      template: {
        compilerOptions: {
          // Web Components del ecosistema (@dotrino/*)
          isCustomElement: (tag) => tag.startsWith('dotrino-'),
        },
      },
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['images/favicon.ico'],
      manifest: {
        name: 'Dotrino',
        short_name: 'Dotrino',
        description: 'Ecosistema de aplicaciones cliente conectadas por proxy WebSocket',
        theme_color: '#f4f7f9',
        background_color: '#f4f7f9',
        display: 'standalone',
        start_url: './',
        scope: './',
        // Deep-links: enfocar la instancia instalada en vez de abrir ventana nueva
        // (Chrome/Edge desktop + Android). Los share-links por #fragment ya caen en
        // scope, así que en Android abren la app instalada.
        launch_handler: { client_mode: 'focus-existing' },
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
        ]
      },
      // Sin cache: el SW solo existe para que la app sea instalable como PWA.
      // No precachea ni hace runtime caching, todas las peticiones van a la red.
      workbox: {
        globPatterns: [],
        skipWaiting: true,
        clientsClaim: true,
        cleanupOutdatedCaches: true,
        runtimeCaching: [],
        navigateFallback: null
      }
    })
  ],
  base: './',
})
