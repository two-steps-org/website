'use client';

import React, { useState, type MouseEvent } from 'react';
import { useReducedMotionQuery } from '../../../utils/scroll';
import { useLocation, useNavigate } from 'react-router-dom';
import LegalModal from './LegalModal';
import SplitText from '../../common/SplitText';
import Scrub from '../../common/Scrub';
import { useDeviceType } from '../../../utils/responsive/hooks/useDeviceType';
import { hapticFeedback } from '../../../utils/mobile/hapticFeedback';
import { type SolutionItem } from './footerData';
import {
  FooterBottomBar,
  FooterBrandColumn,
  FooterContactColumn,
  FooterLinksGrid,
} from './FooterSections';

const handleBookCall = () => {
  window.open('https://calendly.com/yoni-insell-twosteps/30min', '_blank', 'noopener,noreferrer');
};

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
  const deviceType = useDeviceType();
  const isMobile = deviceType === 'mobile';
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
    if (href === '/case-studies') {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

  const handleSolutionNavigation = (item: SolutionItem, event?: MouseEvent<HTMLAnchorElement>) => {
    if (!isMobile) {
      handleNavigation(item.href, event);
      return;
    }

    event?.preventDefault();

    if (location.pathname !== '/') {
      navigate('/', {
        state: {
          targetSection: 'services',
          isSectionNav: true,
          targetService: item.serviceId,
        },
      });
      return;
    }

    scrollToSection('services');
    window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent('servicesFocus', { detail: { serviceId: item.serviceId } }));
    }, 220);
  };

  return (
    <footer className="relative mt-auto w-full bg-transparent border-t border-line touch-manipulation">
      <div className="ts-container relative py-10 md:py-12">
        <Scrub effect="signature" endAtBottom className="mb-12 md:mb-16">
          <SplitText
            as="p"
            delay={0.05}
            stagger={0.05}
            className="ts-display text-ink text-[clamp(32px,4.6vw,64px)] max-w-[16ch] m-0"
            segments={[{ text: 'Your business, two steps' }, { text: 'ahead.', className: 'sig' }]}
          />
        </Scrub>

        <Scrub effect="signature" endAtBottom contentClassName="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 lg:gap-6 items-start">
          <FooterBrandColumn onBookCall={handleBookCall} />
          <FooterLinksGrid
            isMobile={isMobile}
            reduceMotion={reduceMotion}
            expandedSections={expandedSections}
            onToggleSection={toggleSection}
            onNavigate={handleNavigation}
            onSolutionNavigate={handleSolutionNavigation}
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
