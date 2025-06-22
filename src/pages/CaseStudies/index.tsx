import React from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer/Footer';
import CaseStudyGrid from './components/CaseStudyGrid';
import BackgroundGradient from '../../components/common/BackgroundGradient';
import { useBreakpoint } from '../../utils/responsive/hooks';
import CaseStudiesHero from './components/CaseStudiesHero';

const CaseStudies: React.FC = () => {
  const breakpoint = useBreakpoint();

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />
      
      <main className="flex-1 relative w-full">
        <BackgroundGradient>
          <CaseStudiesHero />
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
            <CaseStudyGrid />
          </div>
        </BackgroundGradient>
      </main>

      <Footer />
    </div>
  );
};

export default React.memo(CaseStudies);
