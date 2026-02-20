import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression';
import { visualizer } from "rollup-plugin-visualizer";
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'Icon - Two Steps.png'],
      manifest: {
        name: 'Two Steps AI',
        short_name: 'TwoSteps',
        description: 'Transforming Business Through AI',
        theme_color: '#000000',
        icons: [
          {
            src: 'Icon - Two Steps.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'Icon - Two Steps.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,br,gz}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // <== 365 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    }),
    // Compress assets using Brotli for better compression rates
    compression({
      algorithm: 'brotliCompress',
      ext: '.br'
    }),
    // Also compress assets using gzip for broader browser compatibility
    compression({
      algorithm: 'gzip',
      ext: '.gz'
    }),

    // Generate bundle analysis report for optimization insights
    visualizer({
      filename: "stats.html",
    }) as import('vite').PluginOption,
  ],
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssCodeSplit: true,
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      treeshake: {
        preset: 'recommended',
        propertyReadSideEffects: false,
      },
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'animation-vendor': ['framer-motion'],
          'icons-vendor': ['lucide-react']
        }
      }
    }
  },
  optimizeDeps: {
    // Explicitly include dependencies for faster dev server startup
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'lucide-react'
    ]
  },
  esbuild: {
    logLevel: 'info',
    treeShaking: true,
    // Aggressive minification settings for production builds
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    legalComments: 'none'
  },
  server: {
    port: 5175,
    strictPort: true,
    host: true,
    open: false
  }
});
