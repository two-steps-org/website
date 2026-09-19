import process from 'node:process';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import { compression } from 'vite-plugin-compression2';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    compression({
      algorithms: ['brotliCompress', 'gzip'],
    }),
    ...(process.env.ANALYZE
      ? [visualizer({ filename: 'stats.html' }) as import('vite').PluginOption]
      : []),
  ],
  build: {
    target: 'esnext',
    cssCodeSplit: true,
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rolldownOptions: {
      treeshake: true,
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'react-vendor',
              test: /node_modules\/(react|react-dom|react-router-dom)/,
            },
            {
              name: 'icons-vendor',
              test: /node_modules\/lucide-react/,
            },
          ],
        },
      },
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      'lucide-react',
    ],
  },
  server: {
    port: 3005,
    strictPort: true,
    host: true,
    open: false,
  },
});
