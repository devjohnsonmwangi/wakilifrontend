import type { VitePWAOptions } from 'vite-plugin-pwa';

export const pwaOptions: Partial<VitePWAOptions> = {
  registerType: 'autoUpdate',
  includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'],
  manifest: {
    name: 'Wakili app',
    short_name: 'Wakili',
    description: 'Advocate and commissioner of oaths Progressive Web App',
    theme_color: '#ffffff',
    background_color: '#ffffff',
    display: 'standalone',
    scope: '/',
    start_url: '/',
    icons: [
      {
        src: '/wakilifrontend/public/logo.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/wakilifrontend/public/logo.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/wakilifrontend/public/logo.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  },
  workbox: {
    globPatterns: ['**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}'],
    // THIS IS THE QUICK FIX - NOT A GOOD LONG-TERM SOLUTION
    maximumFileSizeToCacheInBytes: 50 * 1024 * 1024, // e.g., 11 MiB to allow your 10.3MB file
    // ... other workbox options
  
   // Example: To avoid caching large sourcemaps if 'hidden' isn't enough for your PWA caching
    globIgnores: ['**/*.map'],
    //If your app is an SPA and uses client-side routing for all paths
    navigateFallback: '/index.html',
    cleanupOutdatedCaches: true, // Important to remove old caches on new service worker activation
   // Consider runtimeCaching for API calls or third-party assets
    runtimeCaching: [
      {
        urlPattern: /^https:\/\/yourapi\.example\.com\//,
        handler: 'NetworkFirst', // Or 'CacheFirst', 'StaleWhileRevalidate'
        options: {
          cacheName: 'api-cache',
          expiration: {
            maxEntries: 50,
            maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
          },
          cacheableResponse: {
            statuses: [0, 200],
          },
        },
      },
    ],
  },
  devOptions: {
    enabled: false, // Usually enable PWA features only for builds, not during dev for faster HMR
    type: 'module',
  },
 
};