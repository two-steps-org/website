import React, { lazy, ComponentType } from 'react';

// Track loaded components
const loadedComponents = new Set<string>();
const loadingComponents = new Map<string, Promise<any>>();

// Get component name from factory
function getComponentName(factory: () => Promise<any>): string {
  return factory.toString().split('/').pop()?.split('.')[0] || 'UnknownComponent';
}

// Error fallback component
const ErrorFallback = ({ error }: { error: Error }) => (
  <div className="min-h-[400px] flex items-center justify-center">
    <div className="text-center p-8">
      <h2 className="text-xl font-bold text-red-500 mb-4">Failed to load section</h2>
      <p className="text-gray-400 mb-4">{error.message}</p>
      <button 
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
      >
        Retry
      </button>
    </div>
  </div>
);

// Utility for lazy loading components with retry logic
export function lazyLoadWithRetry<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  retries = 3,
  delay = 1000
): Promise<{ default: T }> {
  const componentName = getComponentName(factory);

  // Return cached component if already loaded
  if (loadedComponents.has(componentName)) {
    return loadingComponents.get(componentName)!;
  }

  // Return in-progress loading if already loading
  if (loadingComponents.has(componentName)) {
    return loadingComponents.get(componentName)!;
  }

  // Create new loading promise
  const loadPromise = new Promise<{ default: T }>((resolve, reject) => {
    factory()
      .then(module => {
        if (process.env.NODE_ENV === 'development') {
          console.log(`Component ${componentName} loaded successfully`);
        }
        loadedComponents.add(componentName);
        loadingComponents.set(componentName, Promise.resolve(module));
        resolve(module);
      })
      .catch((error) => {
        console.warn(`Component ${componentName} load failed, retrying...`, error);
        if (retries === 0) {
          console.error(`Component ${componentName} failed to load after retries:`, error);
          loadingComponents.delete(componentName);
          reject(error);
          return;
        }
        // Exponential backoff
        const backoffDelay = delay * Math.pow(2, 3 - retries);
        setTimeout(() => {
          lazyLoadWithRetry(factory, retries - 1, backoffDelay).then(resolve, reject);
        }, backoffDelay);
      });
  });

  // Store loading promise
  loadingComponents.set(componentName, loadPromise);
  return loadPromise;
}

// Preload components in the background
export function preloadComponents(factories: Array<() => Promise<any>>) {
  // Use requestIdleCallback if available, otherwise setTimeout
  const schedule = window.requestIdleCallback || ((cb) => setTimeout(cb, 1));

  schedule(() => {
    factories.forEach(factory => {
      const componentName = getComponentName(factory);
      if (!loadedComponents.has(componentName) && !loadingComponents.has(componentName)) {
        lazyLoadWithRetry(factory, 3, 1000)
          .catch(error => {
            console.warn(`Failed to preload ${componentName}:`, error);
          });
      }
    });
  });
}

// Optimize component imports
export const optimizeImport = <T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>
) => lazy(() => lazyLoadWithRetry(importFn, 3, 1000)
  .catch((error: Error) => {
    console.error('Failed to load component:', error);
    return {
      default: () => <ErrorFallback error={error} />
    } as unknown as { default: T };
  })
);

// Bundle size analyzer
export function analyzeBundleSize(module: any): number {
  return new Blob([JSON.stringify(module)]).size;
}
