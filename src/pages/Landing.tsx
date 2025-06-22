import React, { Suspense, useEffect, useRef, memo } from 'react';
import Navbar from '../components/navigation/Navbar';
import Footer from '../components/Footer/Footer';
import { ErrorBoundary } from '../components/common/ErrorBoundary';
import ParticleBackground from '../components/ParticleBackground';
import { optimizeImport, preloadComponents } from '../utils/performance/optimizations/bundleOptimization';

// Loading fallback component
const SectionLoadingFallback = () => (
  <div className="min-h-[400px] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
  </div>
);

// Error fallback component
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

// Lazy load components with error boundaries
const Hero = React.lazy(() => 
  import('../components/Hero')
    .then(module => module)
    .catch(error => ({
      default: () => <SectionErrorFallback error={error} />
    }))
);

const Services = React.lazy(() => 
  import('../components/Services')
    .then(module => module)
    .catch(error => {
      console.error('Failed to load Services component:', error);
      return { default: () => <SectionErrorFallback error={error} /> };
    })
);

const WhyUs = React.lazy(() => 
  import('../components/WhyUs')
    .then(module => module)
    .catch(error => {
      console.error('Failed to load WhyUs component:', error);
      return { default: () => <SectionErrorFallback error={error} /> };
    })
);

const Process = React.lazy(() => 
  import('../components/Process')
    .then(module => module)
    .catch(error => {
      console.error('Failed to load Process component:', error);
      return { default: () => <SectionErrorFallback error={error} /> };
    })
);

const Team = React.lazy(() => 
  import('../components/Team')
    .then(module => module)
    .catch(error => {
      console.error('Failed to load Team component:', error);
      return { default: () => <SectionErrorFallback error={error} /> };
    })
);

const FAQ = React.lazy(() => 
  import('../components/FAQ')
    .then(module => module)
    .catch(error => {
      console.error('Failed to load FAQ component:', error);
      return { default: () => <SectionErrorFallback error={error} /> };
    })
);

const DashboardSection = React.lazy(() => 
  import('../components/DashboardSection')
    .then(module => module)
    .catch(error => {
      console.error('Failed to load DashboardSection component:', error);
      return { default: () => <SectionErrorFallback error={error} /> };
    })
);

const Landing: React.FC = () => {
  const mainRef = useRef<HTMLDivElement>(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      // Prevent scroll restoration
      if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
      }
      // Force initial scroll position immediately
      window.scrollTo(0, 0);
      // Force again after a small delay to account for lazy loading
      setTimeout(() => window.scrollTo(0, 0), 100);
      isFirstRender.current = false;
    }

    // Handle hash navigation after components are loaded
    const handleHashNavigation = () => {
      const hash = window.location.hash;
      if (!hash) return;
      const targetId = hash.slice(1);
      const element = document.getElementById(targetId);
      if (element) {
        const navHeight = 56;
        const rect = element.getBoundingClientRect();
        const offsetPosition = rect.top + window.pageYOffset - navHeight;
        window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      }
    };

    const hashTimeoutId = setTimeout(handleHashNavigation, 500);
    return () => clearTimeout(hashTimeoutId);
  }, []);

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden w-full">
      {/* Background Effects */}
      <div className="fixed inset-0">
        <div className="absolute inset-0">
          <ParticleBackground />
        </div>
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      </div>

      {/* Content */}
      <div className="relative flex-1 flex flex-col z-10 w-full min-h-screen">
        <Navbar />

        <main ref={mainRef} className="flex-1 w-full">
          <ErrorBoundary FallbackComponent={SectionErrorFallback}>
            <Suspense fallback={<SectionLoadingFallback />}>
              {/* Hero section */}
              <section id="home">
                <Hero />
              </section>
              {/* Services section */}
              <section id="services">
                <Services />
              </section>
              {/* Dashboard section */}
              <section id="dashboard">
                <DashboardSection />
              </section>
              {/* Why Us section */}
              <section id="why-us">
                <WhyUs />
              </section>
              {/* Process section */}
              <section id="process">
                <Process />
              </section>
              {/* Team section */}
              <section id="team">
                <Team />
              </section>
              {/* FAQ section */}
              <section id="faq">
                <FAQ />
              </section>
            </Suspense>
          </ErrorBoundary>
        </main>

        <div className="relative z-10">
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default memo(Landing);
