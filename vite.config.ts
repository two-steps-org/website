import process from 'node:process';
import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { compression } from 'vite-plugin-compression2';
import { visualizer } from 'rollup-plugin-visualizer';

function bookCallDevApi(): Plugin {
  return {
    name: 'book-call-dev-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const path = (req.url ?? '').split('?')[0];
        if (path !== '/api/book-call' && path !== '/api/book-call/') {
          next();
          return;
        }

        void (async () => {
          try {
            const env = loadEnv(server.config.mode, process.cwd(), '');
            for (const [key, value] of Object.entries(env)) {
              process.env[key] = value;
            }
            const url = new URL(req.url || '/', 'http://localhost');
            const chunks: Buffer[] = [];
            if (req.method === 'POST') {
              await new Promise<void>((resolve, reject) => {
                req.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
                req.on('end', resolve);
                req.on('error', reject);
              });
            }
            const mod = await server.ssrLoadModule('/server/bookCall.ts');
            const result = await mod.handleBookCall({
              method: req.method || 'GET',
              query: Object.fromEntries(url.searchParams),
              body: chunks.length ? Buffer.concat(chunks).toString('utf8') : null,
            });
            res.statusCode = result.status;
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Cache-Control', 'no-store');
            res.end(result.status === 204 ? '' : JSON.stringify(result.body));
          } catch (error) {
            server.config.logger.error(String(error));
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: 'Booking is unavailable.' }));
          }
        })();
      });
    },
  };
}

export default defineConfig({
  plugins: [
    bookCallDevApi(),
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
