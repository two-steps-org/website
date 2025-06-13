import React, { memo } from 'react';
import GlowEffect from './GlowEffect';

interface BackgroundGradientProps {
  children: React.ReactNode;
}

const BackgroundGradient: React.FC<BackgroundGradientProps> = ({ children }) => {
  return (
    <div className="relative w-full">
      {/* Background Effects */}
      <div className="fixed inset-0">
        {/* Dark Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#080B1A] via-black to-[#080B1A] opacity-90" />
        
        {/* Grid Pattern with Enhanced Gradient Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.3),transparent,rgba(0,0,0,0.3))]">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]" />
        </div>

        {/* Animated Gradient Orbs */}
        <GlowEffect color="blue" className="top-0 left-1/4 w-[800px] h-[800px]" />
        <GlowEffect color="purple" className="bottom-0 right-1/4 w-[800px] h-[800px]" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default memo(BackgroundGradient);
