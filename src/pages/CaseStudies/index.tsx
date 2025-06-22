import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer/Footer';
import CaseStudyGrid from './components/CaseStudyGrid';
import BackgroundGradient from '../../components/common/BackgroundGradient';
import { useBreakpoint } from '../../utils/responsive/hooks';

const CaseStudies: React.FC = () => {
  const breakpoint = useBreakpoint();
  const isMobile = ['xs', 'sm'].includes(breakpoint);

  return (
    <div className="flex flex-col min-h-screen w-full">
      <Navbar />
      
      <main className="flex-1 relative w-full">
        <BackgroundGradient>
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-32 pb-16">
            <motion.header
              className="text-center mb-12 sm:mb-20"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.span
                className="text-blue-400 text-sm font-semibold tracking-wider uppercase mb-4 block"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                CASE STUDIES
              </motion.span>
              
              <motion.h1 
                className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <span className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                  Our Success Stories
                </span>
              </motion.h1>
              
              <motion.p
                className="text-gray-400 text-lg sm:text-xl max-w-3xl mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Discover how we've helped businesses transform with AI
              </motion.p>
            </motion.header>

            <CaseStudyGrid />
          </div>
        </BackgroundGradient>
      </main>

      <Footer />
    </div>
  );
};

export default React.memo(CaseStudies);
