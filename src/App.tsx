import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { LazyMotion, MotionConfig, domMax } from 'framer-motion';
import ErrorBoundary from './components/common/ErrorBoundary';
import BaseLayout from './components/layout/BaseLayout';
import Head from './components/Head';

const Home = lazy(() => import('./pages/Home'));
const CaseStudies = lazy(() => import('./pages/CaseStudies'));
const CaseStudyDetail = lazy(() => import('./pages/CaseStudyDetail'));

const LoadingFallback = () => (
  <div className="min-h-screen bg-black" aria-hidden="true" />
);

const AppContent: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <Head location={location} />
      <ErrorBoundary>
        <LazyMotion features={domMax} strict>
          <MotionConfig reducedMotion="user">
            <Suspense fallback={<LoadingFallback />}>
              <BaseLayout>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/case-studies" element={<CaseStudies />} />
                  <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
                </Routes>
              </BaseLayout>
            </Suspense>
          </MotionConfig>
        </LazyMotion>
      </ErrorBoundary>
    </>
  );
};

const App: React.FC = () => (
  <HelmetProvider>
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AppContent />
    </Router>
  </HelmetProvider>
);

export default App;
