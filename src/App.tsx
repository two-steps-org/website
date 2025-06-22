import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { getDeviceType } from './utils/responsive/device';
import type { DeviceType } from './utils/responsive/device';
import { ErrorBoundary } from './components/common/ErrorBoundary';

interface LazyWithFallbackOptions {
  successLog?: string;
}

// Helper to lazy load components with built-in error fallback
const lazyWithFallback = (
  importFn: () => Promise<any>,
  fallbackTitle: string,
  options?: LazyWithFallbackOptions // Keep options for potential future use, but remove console.log
) => {
  return React.lazy(() =>
    importFn()
      .then(module => {
        // Removed console.log(options?.successLog);
        return module;
      })
      .catch((error: Error) => {
        console.error(`Failed to load component (${fallbackTitle}):`, error.message);
        return {
          default: () => (
            <div className="min-h-screen bg-black flex items-center justify-center">
              <div className="text-center p-8">
                <h2 className="text-xl font-bold text-red-500 mb-4">{fallbackTitle}</h2>
                {error.message && <p className="text-gray-400 mb-4">{error.message}</p>}
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )
        };
      })
  );
};

const Landing = lazyWithFallback(
  () => import('./pages/Landing'),
  'Failed to load page',
  { successLog: 'Landing component loaded successfully' }
);

const CaseStudies = lazyWithFallback(
  () => import('./pages/CaseStudies'),
  'Failed to load case studies'
);

const MobileApp = lazyWithFallback(
  () => import('./pages/mobile/MobileApp'),
  'Failed to load mobile app'
);

const LoadingFallback = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const App: React.FC = () => {
  const deviceType: DeviceType = getDeviceType();
  const isMobile = deviceType === 'mobile' || deviceType === 'tablet';
  const HomeComponent = isMobile ? MobileApp : Landing;

  return (
    <Router>
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomeComponent />} />
            <Route path="/case-studies" element={<CaseStudies />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
};

export default App;
