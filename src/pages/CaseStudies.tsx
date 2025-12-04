import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Search, Filter, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { caseStudies } from '../components/CaseStudies/data';
import type { CaseStudy } from '../components/CaseStudies/types';
import CaseStudyModal from '../components/CaseStudies/CaseStudyModal';
import CaseStudyCard from '../components/CaseStudies/CaseStudyCard';
import CaseStudiesFilters from '../components/CaseStudies/CaseStudiesFilters';
import Logo from '../components/Logo';
import { CaseStudyMetrics } from '../components/CaseStudies/CaseStudyMetrics';

const CaseStudies: React.FC = () => {
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({ industry: '', service: '', year: '' });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleBookCall = () => {
    window.open('https://calendly.com/yoni-insell-twosteps/30min', '_blank');
  };

  // Filtering
  const filteredStudies = useMemo(
    () =>
      searchQuery || !!filters
        ? caseStudies.filter((study) => {
            if (!study) return false;

            const matchesSearch =
              study.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
              study.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesIndustry = !filters.industry || study.industry === filters.industry;
            const matchesService = !filters.service || study.deployedPlatform === filters.service;

            return matchesSearch && matchesIndustry && matchesService;
          })
        : caseStudies,
    [searchQuery, filters],
  );

  // Mobile carousel scroll
  const scrollToIndex = (index: number) => {
    if (containerRef.current) {
      const newIndex = Math.max(0, Math.min(index, filteredStudies.length - 1));
      const scrollWidth = containerRef.current.offsetWidth;
      containerRef.current.scrollTo({
        left: newIndex * scrollWidth,
        behavior: 'smooth',
      });
      setCurrentIndex(newIndex);
    }
  };

  // Track scroll position to update currentIndex
  useEffect(() => {
    const container = containerRef.current;
    if (!container || filteredStudies.length === 0) return;

    const handleScroll = () => {
      if (!container) return;
      const scrollLeft = container.scrollLeft;
      const cardWidth = container.offsetWidth;
      const newIndex = Math.round(scrollLeft / cardWidth);
      const clampedIndex = Math.max(0, Math.min(newIndex, filteredStudies.length - 1));
      
      setCurrentIndex((prevIndex) => {
        // Only update if index actually changed
        return clampedIndex !== prevIndex ? clampedIndex : prevIndex;
      });
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledHandleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    container.addEventListener('scroll', throttledHandleScroll, { passive: true });
    
    // Also listen for scrollend event if available (better for snap scrolling)
    if ('onscrollend' in container) {
      container.addEventListener('scrollend', handleScroll, { passive: true });
    }

    // Initial check
    handleScroll();

    return () => {
      container.removeEventListener('scroll', throttledHandleScroll);
      if ('onscrollend' in container) {
        container.removeEventListener('scrollend', handleScroll);
      }
    };
  }, [filteredStudies.length]);

  // Reset currentIndex when filtered studies change
  useEffect(() => {
    setCurrentIndex(0);
    if (containerRef.current) {
      containerRef.current.scrollTo({ left: 0, behavior: 'auto' });
    }
  }, [filteredStudies]);

  return (
    <>
      <header className="block md:hidden fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-xl border-b border-gray-800/50">
        <div className="px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 text-white">
            <ArrowLeft className="w-5 h-5" />
            <span className="text-lg">Back</span>
          </Link>
          <Logo width="80px" height="100px" />
        </div>
      </header>

      <main className="flex-1 relative w-full pt-20 md:pt-32 pb-16">
        {/* Section Heading */}
        <motion.div
          className="text-center mb-8 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.span className="text-blue-400 text-sm font-semibold tracking-wider uppercase mb-4 block">
            CASE STUDIES
          </motion.span>
          <motion.h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
              Our Success Stories
            </span>
          </motion.h1>
          <motion.p className="text-gray-400 text-base md:text-lg max-w-2xl mx-auto">
            Discover how we've helped businesses transform with AI
          </motion.p>
        </motion.div>

        {/* Mobile Filters & Search */}
        <div className="block md:hidden px-4 sticky top-16 bg-black/95 backdrop-blur-xl border-b border-gray-800/50 py-3 z-20">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search case studies..."
                className="w-full bg-gray-900/50 border border-gray-800/50 rounded-xl pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50"
              />
            </div>

            <div
              className="p-4 border border-gray-800/50 bg-gray-800/60 rounded-xl"
              onClick={() => setShowFilters(true)}
            >
              <Filter size={12} className="text-gray-400" />
            </div>
          </div>
        </div>

        {/* Layouts */}
        {/* Mobile Carousel */}
        <div className="block md:hidden">
          <div className="relative">
            <div
              ref={containerRef}
              className="overflow-x-auto snap-x snap-mandatory scrollbar-hide"
              style={{
                WebkitOverflowScrolling: 'touch',
                scrollBehavior: 'smooth',
                touchAction: 'pan-x',
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
              }}
            >
              <div className="flex">
                {filteredStudies.map((study, index) => (
                  <div
                    key={`${study.title}-${index}`}
                    className="w-full flex-shrink-0 snap-center px-4"
                  >
                    <CaseStudyCard
                      study={study}
                      index={index}
                      onSelect={() => setSelectedStudy(study)}
                    />
                  </div>
                ))}
              </div>
            </div>
            {/* Mobile nav */}
            <div className="flex justify-center items-center mt-6 gap-4">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => scrollToIndex(currentIndex - 1)}
                className="w-10 h-10 rounded-full bg-gray-900/60 border border-gray-800/50 flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5 text-gray-400" />
              </motion.button>
              <div className="flex gap-2">
                {filteredStudies.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex ? 'w-6 bg-blue-500' : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => scrollToIndex(currentIndex + 1)}
                className="w-10 h-10 rounded-full bg-gray-900/60 border border-gray-800/50 flex items-center justify-center"
              >
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Tablet Grid */}
        <div className="hidden md:grid lg:hidden grid-cols-2 gap-6 px-6">
          {caseStudies.map((study, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              {/* Could reuse TabletCaseStudyCard */}
              <div
                onClick={() => setSelectedStudy(study)}
                className="cursor-pointer bg-gray-900/50 rounded-2xl p-6 border border-gray-800/50 hover:border-blue-500/30"
              >
                <h3 className="text-lg font-bold text-white">{study?.title}</h3>
                <p className="text-gray-400 text-sm mt-2 mb-8">{study?.description}</p>

                <CaseStudyMetrics study={study} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Desktop Grid */}
        <div className="hidden lg:block px-8 max-w-7xl mx-auto">
          <div className="space-y-16">
            {caseStudies.map((study, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div
                  onClick={() => setSelectedStudy(study)}
                  className="relative overflow-hidden rounded-3xl bg-gray-900/50 border border-gray-800/50 hover:border-blue-500/30 p-8 grid grid-cols-[1fr,400px] gap-8"
                >
                  <div>
                    <h3
                      className={`text-2xl font-bold bg-gradient-to-r ${study?.gradient} bg-clip-text text-transparent`}
                    >
                      {study?.title}
                    </h3>
                    <p className="text-gray-300 mt-4 mb-8">{study?.description}</p>

                    <CaseStudyMetrics study={study} />
                  </div>
                  <div className="relative h-64 overflow-hidden rounded-xl">
                    <img
                      src={study?.image}
                      alt={study?.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        <CaseStudiesFilters
          isOpen={showFilters}
          filters={filters}
          onClose={() => setShowFilters(false)}
          onFiltersChange={(filter) => setFilters(filter)}
        />

        <CaseStudyModal
          study={selectedStudy || undefined}
          isOpen={!!selectedStudy}
          onClose={() => setSelectedStudy(null)}
          onBookCall={handleBookCall}
        />
      </main>
    </>
  );
};

export default CaseStudies;
