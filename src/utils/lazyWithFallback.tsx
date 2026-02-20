import React from 'react';

export const lazyWithFallback = (
  importFn: () => Promise<{ default: React.ComponentType }>,
  fallbackTitle: string,
  options?: { successLog?: string },
) => {
  return React.lazy(() =>
    importFn()
      .then((module) => {
        if (options?.successLog) {
          console.log(options.successLog);
        }
        return module;
      })
      .catch((error: Error) => {
        return {
          default: () => (
            <div className="min-h-screen bg-black flex items-center justify-center">
              <div className="text-center p-8">
                <h2 className="text-xl font-bold text-red-500 mb-4">{fallbackTitle}</h2>
                <p className="text-gray-400 mb-4">{error.message}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          ),
        };
      }),
  );
};
