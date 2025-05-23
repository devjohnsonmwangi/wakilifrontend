import { defineConfig, splitVendorChunkPlugin } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import { pwaOptions } from './pwa.config'; // Import your separated PWA options

// Optional: for analyzing bundle size. Install with `npm install -D rollup-plugin-visualizer`
// import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    plugins: [
      react(),
      VitePWA(pwaOptions),
      splitVendorChunkPlugin(), // Automatically splits vendor code into a separate chunk

      // --- Bundle Analyzer (Optional) ---
      // Uncomment to use. Will generate stats.html in your dist folder after build.
      // isProduction && visualizer({
      //   open: false, // Set to true to open automatically in browser
      //   filename: 'dist/stats.html',
      //   gzipSize: true,
      //   brotliSize: true,
      // }),
    ].filter(Boolean), // Filters out falsy values if visualizer is conditional

    build: {
      // Increase warning limit for chunks. Default is 500KB.
      // This is just a warning, not an error. Aim to keep chunks reasonably sized.
      chunkSizeWarningLimit: 1600, // kB

      // Sourcemaps:
      // 'hidden': Generates sourcemaps but doesn't link them (good for error reporting services).
      // true: Generates and links (good for dev, can be large for prod).
      // false: No sourcemaps (fastest build, smallest output, harder debugging in prod).
      sourcemap: isProduction ? 'hidden' : true,

      rollupOptions: {
        output: {
          // --- Manual Chunks ---
          // This is highly project-specific. Analyze your bundle with visualizer
          // and then decide how to split. Start without this and add as needed.
          manualChunks() {
            // Example: Grouping specific large libraries
            // if (id.includes('node_modules/chart.js')) {
            //   return 'chartjs';
            // }
            // if (id.includes('node_modules/three')) {
            //   return 'threejs';
            // }
            // if (id.includes('node_modules/@fullcalendar')) {
            //  return 'fullcalendar-vendor';
            // }

            // Example: Grouping features (if you have clear feature folders)
            // if (id.includes('src/features/admin/')) {
            //   return 'feature-admin';
            // }
            // if (id.includes('src/features/reporting/')) {
            //   return 'feature-reporting';
            // }

            // Default behavior if no manual chunk matches (Vite's auto splitting)
            return undefined;
          },
        },
        // Consider 'treeshake.preset: "recommended"' for more aggressive tree-shaking if needed
        // treeshake: {
        //   preset: 'recommended',
        // },
      },

      // Minification:
      // 'terser' usually gives better compression but is slower.
      // 'esbuild' is much faster but might result in slightly larger bundles.
      // For Vercel free tier where build time matters, 'esbuild' might be a good first try if 'terser' is too slow.
      minify: isProduction ? 'terser' : false, // Set to 'esbuild' to test faster minification
      terserOptions: isProduction
        ? {
            compress: {
              drop_console: true, // Remove console.* calls
              passes: 1, // `1` is faster than `2`. `2` might give slightly better compression.
            },
            mangle: true, // Shorten variable names
            format: {
              comments: false, // Remove comments
            },
          }
        : {},
        
      // If using esbuild for minification:
      // esbuild: isProduction ? {
      //   drop: ['console', 'debugger'],
      //   pure: ['Math.random'], // Example of marking functions as pure
      //   minifyIdentifiers: true,
      //   minifySyntax: true,
      //   minifyWhitespace: true,
      // } : false,

      // Set to false to disable generating Broti-compressed versions of assets.
      // This can save a little build time if not needed (Vercel handles compression).
      // reportCompressedSize: false, // Default is true
    },

    // --- Optimize Dependencies (for Dev Server Speed) ---
    // Vite pre-bundles these for faster dev server startup and HMR.
    // Add large or common CJS dependencies here.
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        '@reduxjs/toolkit',
        '@reduxjs/toolkit/query/react',
        'date-fns',
        '@fullcalendar/react',
        '@fullcalendar/daygrid',
        '@fullcalendar/timegrid',
        '@fullcalendar/interaction',
        '@fullcalendar/list',
        // Add other major dependencies used throughout your app
        // 'axios', 'lodash-es', 'framer-motion', 'sonner',
      ],
      // exclude: ['your-problematic-dependency'] // If a dep causes issues with pre-bundling
    },

    // Consider enabling if you face issues with deep CJS dependencies
    // build: {
    //   commonjsOptions: {
    //     transformMixedEsModules: true,
    //   }
    // }
  };
});