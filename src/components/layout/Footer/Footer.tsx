'use client';

import React, { useState, type MouseEvent } from 'react';
import { useMediaQuery, useReducedMotionQuery } from '../../../utils/scroll';
import { useLocation, useNavigate } from 'react-router-dom';
import LegalModal from './LegalModal';
import Scrub from '../../common/Scrub';
import { hapticFeedback } from '../../../utils/mobile/hapticFeedback';
import {
  FooterBottomBar,
  FooterBrandColumn,
  FooterContactColumn,
  FooterLinksGrid,
} from './FooterSections';

const scrollToSection = (sectionId: string) => {
  window.setTimeout(() => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 80);
};

const Footer: React.FC = () => {
  const reduceMotion = useReducedMotionQuery();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 767px)');
  const [selectedLegal, setSelectedLegal] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    navigation: false,
    solutions: false,
    contact: false,
    legal: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
    hapticFeedback.selection();
  };

  const handleNavigation = (href: string, event?: MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith('/#')) {
      event?.preventDefault();
      const sectionId = href.slice(2);

      if (location.pathname !== '/') {
        navigate('/', { state: { targetSection: sectionId, isSectionNav: true } });
      } else {
        scrollToSection(sectionId);
      }
      return;
    }

    event?.preventDefault();
    navigate(href);
  };

  return (
    <footer className="relative mt-auto w-full bg-transparent border-t border-line touch-manipulation">
      <div className="ts-container relative py-10 md:py-12">
        <Scrub effect="signature" endAtBottom contentClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-6 items-start">
          <FooterBrandColumn />
          <FooterLinksGrid
            isMobile={isMobile}
            reduceMotion={reduceMotion}
            expandedSections={expandedSections}
            onToggleSection={toggleSection}
            onNavigate={handleNavigation}
          />
          <FooterContactColumn
            isMobile={isMobile}
            reduceMotion={reduceMotion}
            expandedSections={expandedSections}
            onToggleSection={toggleSection}
            onSelectLegal={setSelectedLegal}
          />
        </Scrub>

        <FooterBottomBar isMobile={isMobile} onSelectLegal={setSelectedLegal} />

        <div className="h-0 mobile-safe-pb" />
      </div>

      <LegalModal type={selectedLegal} onClose={() => setSelectedLegal(null)} />
    </footer>
  );
};

export default Footer;
