import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CaseStudyCard from './CaseStudyCard';
import CaseStudyModal from './CaseStudyModal';
import { caseStudies } from '../../../components/CaseStudies/data';
import type { CaseStudy } from '../../../components/CaseStudies/types';
import { useBreakpoint } from '../../../utils/responsive/hooks';
import ResponsiveGrid from '../../../components/common/ResponsiveGrid';

const CaseStudyGrid = () => {
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);
  const breakpoint = useBreakpoint();
  const isMobile = ['xs', 'sm'].includes(breakpoint);

  const handleBookCall = () => {
    window.open('https://calendly.com/yoniinsell/30min', '_blank');
  };

  return (
    <>
      <ResponsiveGrid cols={{ xs: 1, md: 2, xl: 3 }} gap="gap-8 lg:gap-10">
        {caseStudies.map((study, index) => (
          <CaseStudyCard
            key={index}
            study={study}
            index={index}
            onSelect={setSelectedStudy}
            isMobile={isMobile}
          />
        ))}
      </ResponsiveGrid>

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