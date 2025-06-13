import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Search, Filter } from 'lucide-react';
import MobileNavbar from '../MobileNavbar';
import MobileFooter from '../MobileFooter';
import MobileHeader from './components/MobileHeader';
import MobileCaseStudyCard from './components/MobileCaseStudyCard';
import MobileCaseStudyModal from './components/MobileCaseStudyModal';
import MobileFilters from './components/MobileFilters';
import ScrollToTop from '../ScrollToTop';
import { caseStudies } from '../../../components/CaseStudies/data';
import type { CaseStudy } from '../../../components/CaseStudies/types';

const MobileCaseStudies = () => {
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    industry: '',
    service: '',
    year: ''
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleBookCall = () => {
    window.open('https://calendly.com/yoniinsell/30min', '_blank');
  };

  const scrollToIndex = (index: number) => {
    if (containerRef.current) {
      const newIndex = Math.max(0, Math.min(index, filteredStudies.length - 1));
      const scrollWidth = containerRef.current.offsetWidth;
      containerRef.current.scrollTo({
        left: newIndex * scrollWidth,
        behavior: 'smooth'
      });
      setCurrentIndex(newIndex);
    }
  };
  const filteredStudies = caseStudies.filter(study => {
    const matchesSearch = study.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         study.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesIndustry = !filters.industry || study.industry === filters.industry;
    const matchesService = !filters.service || study.deployedPlatform === filters.service;
    
    return matchesSearch && matchesIndustry && matchesService;
  });

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <MobileNavbar />

      {/* Header */}
      <MobileHeader />

      {/* Search and Filters */}
      <div className="sticky top-0 z-20 bg-black/95 backdrop-blur-xl border-b border-gray-800/50 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search case studies..."
              className="w-full bg-gray-900/50 border border-gray-800/50 rounded-xl pl-10 pr-4 py-2.5 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500/50"
            />
          </div>
          <button
            onClick={() => setShowFilters(true)}
            className="p-2.5 rounded-xl bg-gray-900/50 border border-gray-800/50"
          >
            <Filter className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="py-6">
        <div className="relative">
          <div
            ref={containerRef}
            className="overflow-hidden snap-x snap-mandatory touch-pan-x"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            <div className="flex">
              {filteredStudies.map((study, index) => (
                <div
                  key={`${study.id}-${study.title}`}
                  className="w-full flex-shrink-0 snap-center px-4"
                >
                  <MobileCaseStudyCard
                    study={study}
                    index={index}
                    onSelect={() => setSelectedStudy(study)}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Controls */}
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
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? 'w-6 bg-blue-500'
                      : 'bg-gray-600 hover:bg-gray-500'
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
      </main>

      {/* Filters Modal */}
      <MobileFilters
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* Case Study Modal */}
      <MobileCaseStudyModal
        study={selectedStudy}
        onClose={() => setSelectedStudy(null)}
        onBookCall={handleBookCall}
      />

      {/* Scroll to Top */}
      <ScrollToTop />
      
      {/* Footer */}
      <MobileFooter />
    </div>
  );
};

export default MobileCaseStudies;