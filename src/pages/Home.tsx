'use client';

import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import ErrorBoundary from '../components/common/ErrorBoundary';
import Hero from '../components/Hero';
import ProofStrip from '../components/ProofStrip';
import WorkRail from '../components/WorkRail';
import Testimonials from '../components/Testimonials';
import Services from '../components/Services';
import BentoGrid from '../components/BentoGrid/BentoGrid';
import WhyUs from '../components/WhyUs';
import Process from '../components/Process';
import Team from '../components/Team';
import FAQ from '../components/FAQ';

const SectionErrorFallback = ({ error }: { error: Error }) => (
  <div className="min-h-[200px] flex items-center justify-center p-4">
    <div className="text-center">
      <p className="text-muted text-sm">{error.message}</p>
    </div>
  </div>
);

const Home = () => {
  const location = useLocation();
  const hasConsumedSectionNav = useRef(false);
  const navState = (location.state as { targetSection?: string; isSectionNav?: boolean } | null) ?? null;
  const targetSection = navState?.isSectionNav ? navState.targetSection ?? null : null;

  useLayoutEffect(() => {
    if (targetSection) {
      hasConsumedSectionNav.current = true;
      const sectionId = targetSection;
      const root = document.documentElement;
      const previousScrollBehavior = root.style.scrollBehavior;

      root.style.scrollBehavior = 'auto';

      const jumpToTarget = () => {
        const el = document.getElementById(sectionId);
        if (!el) return false;
        el.scrollIntoView({ behavior: 'auto', block: 'start' });
        return true;
      };

      jumpToTarget();

      const alignTimer = window.setTimeout(jumpToTarget, 120);
      const restoreTimer = window.setTimeout(() => {
        root.style.scrollBehavior = previousScrollBehavior;
      }, 240);

      return () => {
        window.clearTimeout(alignTimer);
        window.clearTimeout(restoreTimer);
      };
    }

    if (!hasConsumedSectionNav.current) {
      window.scrollTo(0, 0);
    }
  }, [targetSection]);

  useEffect(() => {
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
  }, []);

  return (
    <ErrorBoundary FallbackComponent={SectionErrorFallback}>
      <section id="home">
        <Hero />
      </section>

      <ProofStrip />

      <Services />

      <WorkRail />
      <Testimonials />

      <WhyUs />

      <section id="showcase" className="hidden md:block relative w-full py-12 md:py-24 flex flex-col justify-center overflow-hidden">
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <BentoGrid />
        </div>
      </section>

      <Process />
      <Team />
      <FAQ />
    </ErrorBoundary>
  );
};

export default React.memo(Home);
