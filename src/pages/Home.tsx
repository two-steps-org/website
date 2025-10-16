'use client';

import React, { useEffect, Suspense, memo } from 'react';
import { ErrorBoundary } from '../components/common/ErrorBoundary';

const Hero = React.lazy(() => import('../components/Hero'));
const Services = React.lazy(() => import('../components/Services'));
const DashboardSection = React.lazy(() => import('../components/DashboardSection'));
const WhyUs = React.lazy(() => import('../components/WhyUs'));
const Process = React.lazy(() => import('../components/Process'));
const Team = React.lazy(() => import('../components/Team'));
const FAQ = React.lazy(() => import('../components/FAQ'));

const SectionLoadingFallback = () => (
  <div className="min-h-[400px] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const SectionErrorFallback = ({ error }: { error: Error }) => (
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

const Home = () => {
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    setTimeout(() => window.scrollTo(0, 0), 100);

    const handleHashNavigation = () => {
      const hash = window.location.hash;
      if (!hash) return;

      const element = document.getElementById(hash.slice(1));

      if (element) {
        const navHeight = 56;
        const rect = element.getBoundingClientRect();
        const offset = rect.top + window.pageYOffset - navHeight;
        window.scrollTo({ top: offset, behavior: 'smooth' });
      }
    };

    const timeout = setTimeout(handleHashNavigation, 500);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <ErrorBoundary FallbackComponent={SectionErrorFallback}>
      <Suspense fallback={<SectionLoadingFallback />}>
        <section id="home">
          <Hero />
        </section>
        <section id="services">
          <Services />
        </section>
        <section id="dashboard" className="hidden md:block">
          <DashboardSection />
        </section>
        <section id="why-us">
          <WhyUs />
        </section>
        <section id="process">
          <Process />
        </section>
        <section id="team">
          <Team />
        </section>
        <section id="faq">
          <FAQ />
        </section>
      </Suspense>
    </ErrorBoundary>
  );
};

export default memo(Home);
