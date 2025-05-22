// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
// Optional: for analyzing bundle size
// import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.svg', 'robots.txt', 'apple-touch-icon.png'], // Add other static assets if needed
        manifest: {
          name: 'Wakili app',
          short_name: 'KeBest', // Consider a slightly more descriptive short name if space allows
          description: 'Advocate and commissioner of oaths Progressive Web App',
          theme_color: '#ffffff', // Ensure this matches your app's branding
          background_color: '#ffffff',
          display: 'standalone',
          scope: '/', // Defines the navigation scope of this web application's context
          start_url: '/', // Relative to the scope
          icons: [
            {
              src: '/pwa-192x192.png', // Make sure these files exist in your public folder
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
            {
              src: '/pwa-512x512.png', // Consider a different sized maskable icon if you have one
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any maskable',
            },
          ],
        },
        // Optional: Advanced PWA options
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,json,vue,txt,woff2}'], // Cache more file types
          // navigateFallback: '/index.html', // Useful for SPAs
          // runtimeCaching: [ // Example for caching API calls
          //   {
          //     urlPattern: /^https:\/\/api\.example\.com\/.*/,
          //     handler: 'NetworkFirst',
          //     options: {
          //       cacheName: 'api-cache',
          //       expiration: {
          //         maxEntries: 10,
          //         maxAgeSeconds: 60 * 60 * 24 * 7 // 1 week
          //       },
          //       cacheableResponse: {
          //         statuses: [0, 200]
          //       }
          //     }
          //   }
          // ]
        },
        devOptions: {
          enabled: true, // Enable PWA in development if needed for testing
          type: 'module',
        },
      }),
      // Optional: Add visualizer for bundle analysis (run `npm run build` to see output)
      // isProduction && visualizer({
      //   open: true, // Automatically open in browser
      //   gzipSize: true,
      //   brotliSize: true,
      //   filename: "dist/stats.html", // Output file
      // }),
    ].filter(Boolean), // Filter out falsy values like `false` from the visualizer in dev mode

    build: {
      // Increase the chunk size warning limit (default is 500 kB)
      // While it's better to optimize chunks, this can reduce build noise if you have intentionally larger chunks.
      chunkSizeWarningLimit: 1000, // in kB

      // Sourcemap generation can be slow for large projects.
      // 'true' or 'inline' are good for development.
      // 'hidden' generates sourcemaps but doesn't link them (good for error reporting services).
      // Sourcemap generation can be slow for large projects.
      // true or 'inline' are good for development.
      // 'hidden' generates sourcemaps but doesn't link them (good for error reporting services).
      // false disables sourcemaps for smallest bundle and fastest build.
      sourcemap: isProduction ? 'hidden' : true,
          // Manual chunks configuration:
          // This is where you can get very specific about how your code is split.
          // It requires understanding your application's structure and dependencies.
          manualChunks() {
            // Example 1: Put all node_modules into a vendor chunk
            // (splitVendorChunkPlugin often handles this well, but this is another way)
          // You can define manualChunks here if needed for advanced code splitting.
        // plugins: [
          // You can add more Rollup plugins here if needed for advanced optimizations
        // ]
      },
      // Minification options (Terser is used by default)
      minify: isProduction ? 'terser' : false, // 'esbuild' is faster but Terser offers better compression
      terserOptions: isProduction
        ? {
            compress: {
              drop_console: true, // Remove console.log in production
              passes: 2, // More passes can sometimes improve compression but increases build time
            },
            mangle: true, // Mangle variable names
          }
        : {},
    },

    // Server options (mostly for development, but some might indirectly affect build perception)
    server: {
      // open: true, // Automatically open app in browser on dev start
      // fs: {
      //   strict: true, // Enable strict file system checks
      // },
    },

    // Preview options (for `vite preview` command)
    preview: {
      // open: true,
    },

    // Optimize dependencies
    // Vite pre-bundles dependencies during development for speed.
    // You might need to explicitly include or exclude some.
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom', 'date-fns', '@reduxjs/toolkit', '@fullcalendar/react' /* add other key, large, or CJS dependencies */],
      // exclude: ['some-problematic-dep'],
    },
  };
});