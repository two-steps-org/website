'use client';

import React, { useState, type MouseEvent } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import {
  ArrowRight,
  Mail,
  MapPin,
  Phone,
  Facebook,
  Linkedin,
  Instagram,
  MessageSquareText,
  Mic,
  LayoutDashboard,
  Code2,
  X as XIcon,
  LucideIcon,
  ChevronDown,
} from 'lucide-react';
import LegalModal from './LegalModal';
import Logo from '../../Logo';
import clsx from 'clsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDeviceType } from '../../../utils/responsive/hooks/useDeviceType';
import { hapticFeedback } from '../../../utils/mobile/hapticFeedback';

// --- TypeScript Interfaces ---
interface NavItem {
  label: string;
  href: string;
}

interface SolutionItem {
  label: string;
  icon: LucideIcon;
  href: string;
  gradient: string;
}

interface ContactItem {
  icon: LucideIcon;
  text: string;
  href: string;
  gradient: string;
}

interface SocialItem {
  icon: LucideIcon;
  href: string;
  label: string;
  gradient: string;
}

// --- Data Arrays ---
const navigation: NavItem[] = [
  { label: 'Home', href: '/#home' },
  { label: 'Services', href: '/#services' },
  { label: 'Why Us', href: '/#why-us' },
  { label: 'Process', href: '/#process' },
  { label: 'Team', href: '/#team' },
  { label: 'Q&A', href: '/#faq' },
  { label: 'Case Studies', href: '/case-studies' },
];

const solutions: SolutionItem[] = [
  { label: 'AI Chat Agents', icon: MessageSquareText, href: '/#services', gradient: 'from-purple-500 to-pink-500' },
  { label: 'AI Voice Agents', icon: Mic, href: '/#services', gradient: 'from-amber-500 to-orange-500' },
  { label: 'CRM Development', icon: LayoutDashboard, href: '/#services', gradient: 'from-blue-500 to-indigo-500' },
  { label: 'Custom SaaS', icon: Code2, href: '/#services', gradient: 'from-green-500 to-emerald-500' },
];

const contact: ContactItem[] = [
  { icon: MapPin, text: 'Tel Aviv, Israel', href: 'https://maps.google.com', gradient: 'from-blue-500 to-indigo-500' },
  { icon: Mail, text: 'yoni.insell@twosteps.ai', href: 'mailto:yoni.insell@twosteps.ai', gradient: 'from-purple-500 to-pink-500' },
  { icon: Phone, text: '+972 54 4831148', href: 'tel:+972544831148', gradient: 'from-amber-500 to-orange-500' },
];

const social: SocialItem[] = [
  { icon: Facebook, href: 'https://www.facebook.com/twostepsai', label: 'Facebook', gradient: 'from-blue-500 to-indigo-500' },
  { icon: XIcon, href: 'https://x.com/twostepsai', label: 'X (Twitter)', gradient: 'from-purple-500 to-indigo-500' },
  { icon: Linkedin, href: 'https://www.linkedin.com/company/two-steps-ai/', label: 'LinkedIn', gradient: 'from-blue-600 to-blue-800' },
  { icon: Instagram, href: 'https://www.instagram.com/twostepsai', label: 'Instagram', gradient: 'from-purple-500 to-pink-500' },
];

// --- Sub-Components to keep JSX DRY ---
const GradientIconBox = ({ icon: Icon, gradient, className }: { icon: LucideIcon, gradient: string, className?: string }) => (
  <div className={clsx('w-10 h-10 rounded-xl bg-gradient-to-r p-[1px] shrink-0 transition-transform duration-300', gradient, className)}>
    <div className="w-full h-full rounded-xl bg-gray-900 flex items-center justify-center group-hover:bg-gray-800 transition-colors duration-300">
      <Icon className="w-5 h-5 text-white" />
    </div>
  </div>
);

const Footer: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const deviceType = useDeviceType();
  const isMobile = deviceType === 'mobile';
  const [selectedLegal, setSelectedLegal] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    navigation: false,
    solutions: false,
    contact: false,
  });

  const handleBookCall = () => {
    window.open('https://calendly.com/yoni-insell-twosteps/30min', '_blank', 'noopener,noreferrer');
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
    hapticFeedback.selection();
  };

  // Collapsible Section Component for Mobile
  const CollapsibleSection: React.FC<{
    title: string;
    sectionKey: string;
    children: React.ReactNode;
  }> = ({ title, sectionKey, children }) => {
    const isExpanded = expandedSections[sectionKey];

    if (!isMobile) {
      return (
        <div>
          <h3 className="text-lg font-semibold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            {title}
          </h3>
          {children}
        </div>
      );
    }

    return (
      <div>
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between py-4 border-b border-gray-800/50 min-h-[52px]"
          aria-expanded={isExpanded}
        >
          <h3 className="text-base font-semibold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            {title}
          </h3>
          <m.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-gray-400"
          >
            <ChevronDown className="w-5 h-5" />
          </m.div>
        </button>
        <AnimatePresence>
          {isExpanded && (
            <m.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="py-4">
                {children}
              </div>
            </m.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const scrollToSection = (sectionId: string) => {
    window.dispatchEvent(new CustomEvent('navForceLoad'));
    window.setTimeout(() => {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  };

  const handleNavigation = (href: string, event?: MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith('/#')) {
      event?.preventDefault();
      const sectionId = href.startsWith('/#') ? href.slice(2) : href.slice(1);

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

  return (
    <footer className="relative mt-auto w-full bg-gradient-to-b from-[#080B1A] to-black touch-manipulation">
      <div className="relative max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 py-10 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 items-start">
          
          {/* Company Info */}
          <div className="space-y-6 md:col-span-2 lg:col-span-1">
            <div className="w-auto">
              <Logo className="w-36 md:w-40 lg:w-44 h-auto" />
            </div>
            <div className="space-y-4">
              <p className="text-white leading-relaxed">
                <span className="font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Always Be Ahead
                </span>
                <br />
                We craft custom AI solutions, turning complex challenges into seamless automation
              </p>
            </div>
            <div className="flex space-x-3">
              {social.filter((item) => item.href !== '#').map((item: SocialItem) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => hapticFeedback.selection()}
                  className={clsx(
                    'w-10 h-10 min-h-[44px] min-w-[44px] rounded-xl bg-gradient-to-r p-[1px] group cursor-pointer',
                    'transition-transform duration-300 hover:scale-110 hover:-translate-y-0.5 active:scale-95',
                    item.gradient
                  )}
                  aria-label={`Visit our ${item.label} page`}
                >
                  <div className="w-full h-full rounded-xl bg-gray-900 hover:bg-gray-800 flex items-center justify-center transition-all duration-300">
                    <item.icon className="w-5 h-5 text-white" />
                  </div>
                </a>
              ))}
            </div>
            <m.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                handleBookCall();
                hapticFeedback.success();
              }}
              aria-label="Book a Call via Calendly"
              className="px-6 py-3 rounded-xl font-medium bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center gap-2 group min-h-[48px]"
            >
              Book a Call
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </m.button>
          </div>
          
          {/* Navigation & Solutions */}
          <div className="md:col-span-2 lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-4 pl-2 lg:pl-4">
            {/* Navigation */}
            <CollapsibleSection title="Navigation" sectionKey="navigation">
              <ul className="grid grid-cols-2 gap-y-5 gap-x-5">
                {navigation.map((item: NavItem) => {
                  return (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        onClick={(event) => {
                          handleNavigation(item.href, event);
                          hapticFeedback.selection();
                        }}
                        className="group block w-full text-left min-h-[44px]"
                        aria-label={`Navigate to ${item.label}`}
                      >
                        <span className="text-gray-400 group-hover:text-blue-400 transition-colors duration-300 flex items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-500 mr-3 group-hover:bg-blue-400 group-hover:scale-125 transition-all duration-300 shrink-0" />
                          <span className="relative flex items-center">
                            <span className="relative inline-block">
                              {item.label}
                              <span className="absolute -bottom-1 left-0 w-0 h-px bg-blue-400 transition-all duration-300 group-hover:w-full" />
                            </span>
                            <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                          </span>
                        </span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            </CollapsibleSection>

            {/* Solutions */}
            <CollapsibleSection title="Solutions" sectionKey="solutions">
              <ul className="space-y-5">
                {solutions.map((item: SolutionItem) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      onClick={(event) => {
                        handleNavigation(item.href, event);
                        hapticFeedback.selection();
                      }}
                      className="flex items-center gap-3 group w-full text-left min-h-[44px]"
                      aria-label={`Learn more about ${item.label}`}
                    >
                      <GradientIconBox icon={item.icon} gradient={item.gradient} className="group-hover:scale-110" />
                      <span className="text-gray-400 hover:text-blue-400 transition-colors duration-300 flex items-center group">
                        <span className="relative flex items-center">
                          <span className="relative inline-block">
                            {item.label}
                            <span className="absolute -bottom-1 left-0 w-0 h-px bg-blue-400 transition-all duration-300 group-hover:w-full" />
                          </span>
                          <ArrowRight className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </CollapsibleSection>
          </div>

          {/* Contact */}
          <div className="lg:col-span-1 pl-2 lg:pl-4">
            <CollapsibleSection title="Contact Us" sectionKey="contact">
              <ul className="space-y-5">
                {contact.map((item: ContactItem, index: number) => (
                  <li key={index}>
                    <a
                      href={item.href}
                      className="flex items-center gap-3 group min-h-[44px]"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <GradientIconBox icon={item.icon} gradient={item.gradient} className="group-hover:scale-110" />
                      <span className="text-gray-400 group-hover:text-blue-400 transition-colors duration-300">
                        {item.text}
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </CollapsibleSection>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-gray-800/50">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
            {/* Copyright */}
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} Two Steps. All Rights Reserved.
            </p>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              {['privacy', 'terms', 'cookies'].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setSelectedLegal(type);
                    hapticFeedback.light();
                  }}
                  className="text-gray-400 hover:text-white transition-colors duration-300 text-sm capitalize min-h-[44px]"
                  aria-label={`View ${type === 'terms' ? 'Terms of Service' : `${type} Policy`}`}
                >
                  {type === 'terms' ? 'Terms of Service' : `${type} Policy`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Safe area inset for mobile */}
        <div className="h-0" style={{ paddingBottom: '0px' }} />
      </div>

      <LegalModal type={selectedLegal} onClose={() => setSelectedLegal(null)} />
    </footer>
  );
};

export default Footer;
