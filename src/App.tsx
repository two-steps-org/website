import React, { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LazyMotion, domAnimation } from 'framer-motion';
import ErrorBoundary from './components/common/ErrorBoundary';
import BaseLayout from './components/layout/BaseLayout';
import { lazyWithFallback } from './utils/lazyWithFallback';

const Home = lazyWithFallback(
  () => import('./pages/Home'),
  'Failed to load home page'
);

const CaseStudies = lazyWithFallback(
  () => import('./pages/CaseStudies'),
  'Failed to load case studies'
);

const LoadingFallback = () => (
  <div className="min-h-screen bg-black" aria-hidden="true" />
);

const App: React.FC = () => {
  React.useEffect(() => {
    // Reveal the app as soon as it mounts
    requestAnimationFrame(() => {
      document.body.classList.remove('loading');
      document.body.classList.add('loaded');
    });
  }, []);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ErrorBoundary>
        <LazyMotion features={domAnimation}>
          <Suspense fallback={<LoadingFallback />}>
            <BaseLayout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/case-studies" element={<CaseStudies />} />
              </Routes>
            </BaseLayout>
          </Suspense>
        </LazyMotion>
      </ErrorBoundary>
    </Router>
  );
};

export default App;
