import React from 'react';
import { motion } from 'framer-motion';
import ParticleBackground from '../../components/ParticleBackground';
import {
  MobileNavbar,
  MobileHero,
  MobileServices,
  MobileWhyUs,
  MobileProcess,
  MobileTeam,
  MobileFAQ,
  MobileFooter,
  ScrollToTop
} from '../../components/mobile';

const MobileApp: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black relative">
      {/* Background Effects */}
      <div className="fixed inset-0">
        <ParticleBackground />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <MobileNavbar />
        <main className="flex-1">
          <MobileHero />
          <MobileServices />
          <MobileWhyUs />
          <MobileProcess />
          <MobileTeam />
          <MobileFAQ />
        </main>
        <MobileFooter />
        <ScrollToTop />
      </div>
    </div>
  );
};

export default MobileApp;