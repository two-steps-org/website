import React from 'react';
import BentoGrid from './BentoGrid';

const BentoGridSection: React.FC = () => {
  return (
    <section className="relative w-full py-12 md:py-24 flex flex-col justify-center overflow-hidden">
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <BentoGrid />
      </div>
    </section>
  );
};

export default React.memo(BentoGridSection);
