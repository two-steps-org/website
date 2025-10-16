import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import compression from 'vite-plugin-compression';
import { visualizer } from "rollup-plugin-visualizer";

export default defineConfig({
  plugins: [
    react(),
    // Compress assets using Brotli for better compression rates
    compression({
      algorithm: 'brotli',
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
    }),
  ],
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssCodeSplit: true,
    sourcemap: false,
    // Increase chunk size warning limit to avoid unnecessary warnings
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Manually chunk vendor libraries for improved caching
        manualChunks: {
          'vendor-react': ['react', 'react-dom'],
          'vendor-router': ['react-router-dom'],
          'vendor-animations': ['framer-motion'],
          'vendor-icons': ['lucide-react'],
          'vendor-spline': ['@splinetool/runtime', '@splinetool/react-spline']
        }
      },
      treeshake: {
        // Fine-tuning tree-shaking settings for optimal build output
        moduleSideEffects: true,
        propertyReadSideEffects: false,
        tryCatchDeoptimization: false
      },
    }
  },
  optimizeDeps: {
    // Explicitly include dependencies for faster dev server startup
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'lucide-react',
      '@splinetool/runtime',
      '@splinetool/react-spline'
    ],
    // Exclude modules that are handled differently to prevent duplication
    exclude: ['@splinetool/runtime']
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
    // Security and caching headers for the dev server
    headers: {
      'Cache-Control': 'public, max-age=31536000',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY'
    }
  }
});
