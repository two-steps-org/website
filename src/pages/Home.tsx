'use client';

import React, { useLayoutEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ErrorBoundary from '../components/common/ErrorBoundary';
import Hero from '../components/Hero';
import ProofStrip from '../components/ProofStrip';
import WorkRail from '../components/WorkRail';
import Testimonials from '../components/Testimonials';
import CtaBand from '../components/CtaBand';
import Services from '../components/Services';
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
  const navigate = useNavigate();
  const hasConsumedSectionNav = useRef(false);
  const navState = (location.state as { targetSection?: string; isSectionNav?: boolean } | null) ?? null;
  // Section to land on: in-app nav passes it as state, a deep link as the hash.
  const targetSection =
    (navState?.isSectionNav ? navState.targetSection : null) ?? (location.hash.slice(1) || null);

  useLayoutEffect(() => {
    if (targetSection && targetSection !== 'home') {
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
        // Landed: drop the state and the hash so neither can re-anchor later.
        navigate(location.pathname + location.search, { replace: true, state: null });
      }, 240);

      return () => {
        window.clearTimeout(alignTimer);
        window.clearTimeout(restoreTimer);
      };
    }

    if (!hasConsumedSectionNav.current) {
      window.scrollTo(0, 0);
    }
  }, [targetSection, navigate, location.pathname, location.search]);

  return (
    <ErrorBoundary FallbackComponent={SectionErrorFallback}>
      <section id="home">
        <Hero />
      </section>

      <ProofStrip />

      <Services />

      <WorkRail />
      <Testimonials />
      <CtaBand />

      <WhyUs />

      <Process />
      <Team />
      <FAQ />
    </ErrorBoundary>
  );
};

export default React.memo(Home);
