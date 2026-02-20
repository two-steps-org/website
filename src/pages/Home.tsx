'use client';

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import ErrorBoundary from '../components/common/ErrorBoundary';
import { lazyWithFallback } from '../utils/lazyWithFallback';
import { useSharedIntersectionObserver } from '../hooks/useSharedIntersectionObserver';

const Hero = lazyWithFallback(() => import('../components/Hero'), 'Failed to load Hero');
const Services = lazyWithFallback(() => import('../components/Services'), 'Failed to load Services');
const BentoGridSection = lazyWithFallback(() => import('../components/BentoGrid'), 'Failed to load Showcase');
const WhyUs = lazyWithFallback(() => import('../components/WhyUs'), 'Failed to load Why Us');
const Process = lazyWithFallback(() => import('../components/Process'), 'Failed to load Process');
const Team = lazyWithFallback(() => import('../components/Team'), 'Failed to load Team');
const FAQ = lazyWithFallback(() => import('../components/FAQ'), 'Failed to load FAQ');

const SectionLoadingFallback = () => (
  <div className="min-h-[200px]" aria-hidden="true" />
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
  id?: string;
  children: React.ReactNode;
  className?: string;
  forceLoadAll?: boolean;
}> = ({ id, children, className = '', forceLoadAll = false }) => {
  const [sectionRef, isIntersecting] = useSharedIntersectionObserver({
    triggerOnce: true,
    initialVisible: false
  });
  const [shouldLoad, setShouldLoad] = useState(forceLoadAll);

  useEffect(() => {
    if (forceLoadAll) {
      setShouldLoad(true);
    }
  }, [forceLoadAll]);

  useEffect(() => {
    if (isIntersecting) {
      setShouldLoad(true);
    }
  }, [isIntersecting]);

  // Force-load this section immediately when navbar navigates to any hash section.
  // Without this, lazy placeholders (200px tall) cause layout shift after scroll,
  // making the first navbar click land on the wrong section.
  useEffect(() => {
    const handleForceLoad = () => setShouldLoad(true);
    window.addEventListener('navForceLoad', handleForceLoad);
    return () => window.removeEventListener('navForceLoad', handleForceLoad);
  }, []);

  return (
    <div {...(id && { id })} ref={sectionRef} className={className}>
      {shouldLoad ? children : <SectionLoadingFallback />}
    </div>
  );
};

const Home = () => {
  const location = useLocation();
  const hasConsumedSectionNav = useRef(false);
  const navState = (location.state as { targetSection?: string; isSectionNav?: boolean } | null) ?? null;
  const targetSection = navState?.isSectionNav ? navState.targetSection ?? null : null;
  const forceLoadAll = Boolean(targetSection);

  useLayoutEffect(() => {
    if (targetSection) {
      hasConsumedSectionNav.current = true;
      const sectionId = targetSection;
      const root = document.documentElement;
      const previousScrollBehavior = root.style.scrollBehavior;
      let pollTimer: number | null = null;

      // Ensure target sections mount immediately, then jump before paint.
      root.style.scrollBehavior = 'auto';
      window.dispatchEvent(new CustomEvent('navForceLoad'));

      const jumpToTarget = () => {
        const el = document.getElementById(sectionId);
        if (!el) return false;
        el.scrollIntoView({ behavior: 'auto', block: 'start' });
        return true;
      };

      // Keep final alignment stable while lazy sections finish expanding.
      let lastScrollHeight = document.body.scrollHeight;
      let stableCount = 0;
      let attempts = 0;

      const settle = () => {
        jumpToTarget();
        const currentScrollHeight = document.body.scrollHeight;
        attempts++;

        if (currentScrollHeight !== lastScrollHeight) {
          stableCount = 0;
        } else {
          stableCount++;
        }

        lastScrollHeight = currentScrollHeight;

        if (stableCount < 3 && attempts < 40) {
          pollTimer = window.setTimeout(settle, 40);
        }
      };

      const timer1 = window.setTimeout(settle, 80);
      const timer2 = window.setTimeout(settle, 200);
      const timer3 = window.setTimeout(settle, 380);
      const restoreTimer = window.setTimeout(() => {
        root.style.scrollBehavior = previousScrollBehavior;
      }, 500);

      jumpToTarget();
      requestAnimationFrame(settle);

      return () => {
        if (pollTimer) window.clearTimeout(pollTimer);
        window.clearTimeout(timer1);
        window.clearTimeout(timer2);
        window.clearTimeout(timer3);
        window.clearTimeout(restoreTimer);
        root.style.scrollBehavior = previousScrollBehavior;
      };
    }

    // After consuming section-nav state, avoid resetting to top on the follow-up
    // render where location.state is cleared/replaced by the router.
    if (!hasConsumedSectionNav.current) {
      window.scrollTo(0, 0);
    }
  }, [targetSection]);

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }

    // Prefetch all section chunks so they're already cached when the user
    // clicks a navbar link. Without this, dynamic imports on slow connections
    // cause layout shifts that make hash-scroll land on the wrong section.
    import('../components/Services');
    import('../components/WhyUs');
    import('../components/BentoGrid');
    import('../components/Process');
    import('../components/Team');
    import('../components/FAQ');
  }, []);

  return (
    <ErrorBoundary FallbackComponent={SectionErrorFallback}>
      {/* Hero loads immediately */}
      <section id="home">
        <React.Suspense fallback={<SectionLoadingFallback />}>
          <Hero />
        </React.Suspense>
      </section>

      {/* Other sections lazy load */}
      <LazySection forceLoadAll={forceLoadAll}>
        <React.Suspense fallback={<SectionLoadingFallback />}>
          <Services />
        </React.Suspense>
      </LazySection>

      <LazySection forceLoadAll={forceLoadAll}>
        <React.Suspense fallback={<SectionLoadingFallback />}>
          <WhyUs />
        </React.Suspense>
      </LazySection>

      <LazySection id="showcase" className="hidden md:block" forceLoadAll={forceLoadAll}>
        <React.Suspense fallback={<SectionLoadingFallback />}>
          <BentoGridSection />
        </React.Suspense>
      </LazySection>

      <LazySection forceLoadAll={forceLoadAll}>
        <React.Suspense fallback={<SectionLoadingFallback />}>
          <Process />
        </React.Suspense>
      </LazySection>

      <LazySection forceLoadAll={forceLoadAll}>
        <React.Suspense fallback={<SectionLoadingFallback />}>
          <Team />
        </React.Suspense>
      </LazySection>

      <LazySection forceLoadAll={forceLoadAll}>
        <React.Suspense fallback={<SectionLoadingFallback />}>
          <FAQ />
        </React.Suspense>
      </LazySection>
    </ErrorBoundary>
  );
};

export default React.memo(Home);
