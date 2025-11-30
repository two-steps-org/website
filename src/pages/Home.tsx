'use client';

import React, { useEffect, useRef, useState } from 'react';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import { isMobileDevice } from '../utils/responsive/device';

const Hero = React.lazy(() => import('../components/Hero'));
const Services = React.lazy(() => import('../components/Services'));
const DashboardSection = React.lazy(() => import('../components/DashboardSection'));
const WhyUs = React.lazy(() => import('../components/WhyUs'));
const Process = React.lazy(() => import('../components/Process'));
const Team = React.lazy(() => import('../components/Team'));
const FAQ = React.lazy(() => import('../components/FAQ'));

const SectionLoadingFallback = () => (
  <div className="min-h-[200px] flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

const SectionErrorFallback = ({ error }: { error: Error }) => (
  <div className="min-h-[200px] flex items-center justify-center p-4">
    <div className="text-center">
      <p className="text-gray-400 text-sm">{error.message}</p>
    </div>
  </div>
);

// Lazy section with intersection observer
const LazySection: React.FC<{
  id: string;
  children: React.ReactNode;
  className?: string;
}> = ({ id, children, className = '' }) => {
  const [shouldLoad, setShouldLoad] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isMobile = isMobileDevice();

  useEffect(() => {
    // Load immediately on desktop
    if (!isMobile) {
      setShouldLoad(true);
      return;
    }

    // Use intersection observer on mobile
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Start loading 200px before visible
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [isMobile]);

  return (
    <section id={id} ref={sectionRef} className={className}>
      {shouldLoad ? children : <SectionLoadingFallback />}
    </section>
  );
};

const Home = () => {
  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <ErrorBoundary FallbackComponent={SectionErrorFallback}>
      {/* Hero loads immediately */}
      <section id="home">
        <React.Suspense fallback={<SectionLoadingFallback />}>
          <Hero />
        </React.Suspense>
      </section>

      {/* Other sections lazy load on mobile */}
      <LazySection id="services">
        <React.Suspense fallback={<SectionLoadingFallback />}>
          <Services />
        </React.Suspense>
      </LazySection>

      <LazySection id="dashboard" className="hidden md:block">
        <React.Suspense fallback={<SectionLoadingFallback />}>
          <DashboardSection />
        </React.Suspense>
      </LazySection>

      <LazySection id="why-us">
        <React.Suspense fallback={<SectionLoadingFallback />}>
          <WhyUs />
        </React.Suspense>
      </LazySection>

      <LazySection id="process">
        <React.Suspense fallback={<SectionLoadingFallback />}>
          <Process />
        </React.Suspense>
      </LazySection>

      <LazySection id="team">
        <React.Suspense fallback={<SectionLoadingFallback />}>
          <Team />
        </React.Suspense>
      </LazySection>

      <LazySection id="faq">
        <React.Suspense fallback={<SectionLoadingFallback />}>
          <FAQ />
        </React.Suspense>
      </LazySection>
    </ErrorBoundary>
  );
};

export default React.memo(Home);
