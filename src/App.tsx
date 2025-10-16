import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { lazyWithFallback } from './utils/lazyWithFallback';
import BaseLayout from './components/layout/BaseLayout';

const Home = lazyWithFallback(() => import('./pages/Home'), 'Failed to load page');
const CaseStudies = lazyWithFallback(
  () => import('./pages/CaseStudies'),
  'Failed to load case studies',
);

const LoadingFallback = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <ErrorBoundary>
        <Suspense fallback={<LoadingFallback />}>
          <BaseLayout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/case-studies" element={<CaseStudies />} />
            </Routes>
          </BaseLayout>
        </Suspense>
      </ErrorBoundary>
    </Router>
  );
};

export default App;
