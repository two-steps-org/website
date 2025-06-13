import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CaseStudyCard from './CaseStudyCard';
import CaseStudyModal from './CaseStudyModal';
import { caseStudies } from '../../../components/CaseStudies/data';
import type { CaseStudy } from '../../../components/CaseStudies/types';
import { useBreakpoint } from '../../../utils/responsive/hooks';

const CaseStudyGrid = () => {
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);
  const breakpoint = useBreakpoint();
  const isMobile = ['xs', 'sm'].includes(breakpoint);

  const handleBookCall = () => {
    window.open('https://calendly.com/yoniinsell/30min', '_blank');
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-6 sm:gap-8 md:gap-12">
        {caseStudies.map((study, index) => (
          <CaseStudyCard
            key={index}
            study={study}
            index={index}
            onSelect={setSelectedStudy}
            isMobile={isMobile}
          />
        ))}
      </div>

      <AnimatePresence>
        {selectedStudy && (
          <CaseStudyModal
            study={selectedStudy}
            onClose={() => setSelectedStudy(null)}
            onBookCall={handleBookCall}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default CaseStudyGrid;