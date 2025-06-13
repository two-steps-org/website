import { ComponentType } from 'react';

// Chunk loading states
const loadingChunks = new Set<string>();
const loadedChunks = new Set<string>();

// Optimize dynamic imports with chunk loading management
export function optimizeDynamicImport<T>(
  importFn: () => Promise<{ default: T }>,
  chunkName?: string,
  retries = 2
): Promise<{ default: T }> {
  return new Promise((resolve, reject) => {
    const attempt = (retriesLeft: number) => {
      // Track chunk loading
      if (chunkName) {
        if (loadedChunks.has(chunkName)) {
          importFn().then(resolve).catch(reject);
          return;
        }
        loadingChunks.add(chunkName);
      }

      importFn()
        .then((module) => {
          if (chunkName) {
            loadingChunks.delete(chunkName);
            loadedChunks.add(chunkName);
          }
          resolve(module);
        })
        .catch((error) => {
          if (chunkName) {
            loadingChunks.delete(chunkName);
          }
          
          if (retriesLeft === 0) {
            console.error('Dynamic import failed:', error);
            reject(error);
            return;
          }
          
          // Exponential backoff
          const delay = Math.pow(2, 2 - retriesLeft) * 1000;
          setTimeout(() => attempt(retriesLeft - 1), delay);
        });
    };
    
    attempt(retries);
  });
}

// Preload components with priority
export function preloadComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  priority: 'high' | 'low' = 'low'
): void {
  const preloader = () => {
    importFn().catch(console.error);
  };

  if (priority === 'high') {
    // High priority - load immediately
    preloader();
  } else {
    // Low priority - load during idle time
    if (typeof requestIdleCallback !== 'undefined') {
      requestIdleCallback(preloader);
    } else {
      setTimeout(preloader, 0);
    }
  }
}

// Prefetch chunks
export function prefetchChunk(chunk: string): void {
  if (loadedChunks.has(chunk) || loadingChunks.has(chunk)) {
    return;
  }

  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.as = 'script';
  link.href = `/assets/${chunk}.js`;
  document.head.appendChild(link);
}