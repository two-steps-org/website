'use client';

import React, { useState, useRef, useMemo, useEffect, useCallback, useLayoutEffect, type MouseEvent } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  ArrowRight,
  TrendingUp,
  X,
  Menu,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { caseStudies } from '../components/CaseStudies/data';
import type { CaseStudy } from '../components/CaseStudies/types';
import CaseStudyModal from '../components/CaseStudies/CaseStudyModal';
import CaseStudyCard from '../components/CaseStudies/CaseStudyCard';
import Logo from '../components/Logo';

/* ─── constants ──────────────────────────────────────────────────────── */
const BOOK_CALL_URL = 'https://calendly.com/yoni-insell-twosteps/30min';

const navItems = [
  { name: 'Home', url: '/' },
  { name: 'Services', url: '/#services' },
  { name: 'Why Us', url: '/#why-us' },
  { name: 'Process', url: '/#process' },
  { name: 'Team', url: '/#team' },
  { name: 'Q&A', url: '/#faq' },
  { name: 'Case Studies', url: '/case-studies' },
];

/* ─── page ───────────────────────────────────────────────────────────── */
const CaseStudies: React.FC = () => {
  const navigate = useNavigate();
  const [selectedStudy, setSelectedStudy] = useState<CaseStudy | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndustry, setActiveIndustry] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMobileContrastBar, setShowMobileContrastBar] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    });
  }, []);

  const handleBookCall = useCallback(() => {
    window.open(BOOK_CALL_URL, '_blank');
    setIsMenuOpen(false);
  }, []);

  const handleNavigation = useCallback(
    (url: string, event?: MouseEvent<HTMLAnchorElement>) => {
      event?.preventDefault();
      setIsMenuOpen(false);

      if (url.startsWith('/#')) {
        const sectionId = url.replace('/#', '');
        navigate('/', { state: { targetSection: sectionId, isSectionNav: true } });
      } else {
        navigate(url);
      }
    },
    [navigate],
  );

  /* industries for filter chips */
  const industries = useMemo(
    () => ['All', ...Array.from(new Set(caseStudies.map((s) => s.industry)))],
    [],
  );

  /* filtered list */
  const filteredStudies = useMemo(
    () =>
      caseStudies.filter((study) => {
        const q = searchQuery.toLowerCase();
        const matchesSearch =
          !q ||
          study.title.toLowerCase().includes(q) ||
          study.description.toLowerCase().includes(q) ||
          study.industry.toLowerCase().includes(q);
        const matchesIndustry =
          !activeIndustry ||
          activeIndustry === 'All' ||
          study.industry === activeIndustry;
        return matchesSearch && matchesIndustry;
      }),
    [searchQuery, activeIndustry],
  );

  /* mobile carousel helpers */
  const scrollToIndex = (index: number) => {
    if (!containerRef.current) return;
    const clamped = Math.max(0, Math.min(index, filteredStudies.length - 1));
    containerRef.current.scrollTo({
      left: clamped * containerRef.current.clientWidth,
      behavior: 'smooth',
    });
    setCurrentIndex(clamped);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const width = el.clientWidth || 1;
        const idx = Math.round(el.scrollLeft / width);
        setCurrentIndex(Math.max(0, Math.min(idx, filteredStudies.length - 1)));
        ticking = false;
      });
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [filteredStudies.length]);

  useEffect(() => {
    setCurrentIndex(0);
    containerRef.current?.scrollTo({ left: 0, behavior: 'auto' });
  }, [filteredStudies]);

  useEffect(() => {
    if (!isMenuOpen) return;
    if (!window.matchMedia('(max-width: 1023px)').matches) return;

    const body = document.body;
    const html = document.documentElement;

    const previousBodyOverflow = body.style.overflow;
    const previousHtmlOverflow = html.style.overflow;
    const previousHtmlOverscrollBehavior = html.style.overscrollBehavior;

    html.style.overflow = 'hidden';
    html.style.overscrollBehavior = 'none';
    body.style.overflow = 'hidden';

    return () => {
      html.style.overflow = previousHtmlOverflow;
      html.style.overscrollBehavior = previousHtmlOverscrollBehavior;
      body.style.overflow = previousBodyOverflow;
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!window.matchMedia('(max-width: 1023px)').matches) {
      setShowMobileContrastBar(false);
      return;
    }

    const header = headerRef.current;
    const footer = document.querySelector('footer');
    if (!header || !footer) return;

    let rafId = 0;
    const updateContrastState = () => {
      rafId = 0;
      const headerRect = header.getBoundingClientRect();
      const footerRect = footer.getBoundingClientRect();
      const navBottomAbs = window.scrollY + headerRect.bottom;
      const footerTopAbs = window.scrollY + footerRect.top;
      const shouldShow = navBottomAbs >= footerTopAbs && footerRect.bottom > 0;
      setShowMobileContrastBar((prev) => (prev === shouldShow ? prev : shouldShow));
    };

    const onScrollOrResize = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(updateContrastState);
    };

    updateContrastState();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);

    return () => {
      if (rafId) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, []);

  /* ── shared filter chip renderer ── */
  const FilterChips = ({ size = 'sm' }: { size?: 'sm' | 'md' }) =>
    industries.map((industry) => {
      const isActive =
        industry === 'All' ? !activeIndustry : industry === activeIndustry;
      return (
        <button
          key={industry}
          onClick={() => setActiveIndustry(industry === 'All' ? '' : industry)}
          className={[
            'shrink-0 rounded-full font-medium transition-all duration-200',
            size === 'sm' ? 'px-3 py-1 text-xs' : 'px-4 py-2 text-sm',
            isActive
              ? 'bg-blue-500/20 backdrop-blur-xl border border-blue-500/50 text-blue-300'
              : 'bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 text-gray-400 hover:border-blue-500/30 hover:text-gray-300',
          ].join(' ')}
        >
          {industry}
        </button>
      );
    });

  return (
    <>
      {/* ─── Mobile sticky header ──────────────────────────────── */}
      <header ref={headerRef} className="block md:hidden fixed top-4 left-0 right-0 z-50">
        {showMobileContrastBar && (
          <div className="absolute inset-x-0 -top-4 h-24 pointer-events-none bg-gradient-to-b from-black/90 via-black/65 to-transparent backdrop-blur-md" />
        )}
        <nav className="relative max-w-7xl mx-auto flex items-center justify-between h-16 px-6 sm:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center focus:outline-none">
            <Logo />
          </Link>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors min-w-[44px] min-h-[44px]"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </nav>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-black z-40 lg:hidden"
              onClick={() => setIsMenuOpen(false)}
            />

            {/* Drawer Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 right-0 w-full h-full bg-black p-6 flex flex-col z-50 lg:hidden"
            >
              <div className="flex items-center justify-between">
                <a
                  href="/"
                  onClick={(event) => handleNavigation('/', event)}
                  aria-label="Go to Home"
                  className="flex items-center focus:outline-none"
                >
                  <Logo />
                </a>

                <button
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Close menu"
                  className="p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors min-w-[44px] min-h-[44px]"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Nav Items */}
              <div className="mt-6 flex-1 min-h-0 flex flex-col">
                <div className="flex flex-col gap-3.5">
                  {navItems.map((item) => {
                    const isActive = item.url === '/case-studies';
                    return (
                    <a
                      key={item.name}
                      href={item.url}
                      onClick={(event) => handleNavigation(item.url, event)}
                      className={`group relative block text-base font-medium text-left py-3 px-4 rounded-lg transition-colors min-h-[48px] ${
                        isActive ? 'text-white bg-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <span className="relative inline-flex items-center">
                        <span className="relative inline-block">
                          {item.name}
                          {isActive && (
                            <span className="absolute left-0 right-0 -bottom-1 h-[2px] bg-blue-500 rounded-full">
                            </span>
                          )}
                        </span>
                        <ArrowRight
                          className={`w-4 h-4 ml-2 text-white transform transition-all duration-300 ${
                            isActive
                              ? 'opacity-100 translate-x-0'
                              : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-active:opacity-100 group-active:translate-x-0'
                          }`}
                        />
                      </span>
                    </a>
                    );
                  })}
                </div>

                <motion.button
                  onClick={handleBookCall}
                  whileTap={{ scale: 0.98 }}
                  className="mt-6 w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow hover:shadow-purple-500/25 transition-all min-h-[48px]"
                >
                  <span>Book a Call</span>
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="flex-1 relative w-full min-h-screen">

        {/* ─── Hero ─────────────────────────────────────────────── */}
        <section className="pt-24 pb-8 px-4 text-center">

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex mb-4 px-4 sm:px-5 py-2.5 bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent rounded-full backdrop-blur-sm border border-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:border-blue-500/20 hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] transition-all duration-300"
          >
            <span className="text-blue-400 text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2">
              <TrendingUp className="w-4 h-4 animate-[pulse_2s_ease-in-out_infinite]" />
              CASE STUDIES
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-2xl md:text-4xl md:text-5xl font-bold"
          >
            <span className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
              Success Stories
            </span>
          </motion.h1>
        </section>

        {/* ─── Mobile search + chips ─────────────────────── */}
        <div className="block md:hidden bg-black/80 backdrop-blur-sm border-b border-gray-800/30 px-4 py-4">
          <div className="relative mb-4">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="w-full bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 rounded-xl pl-10 pr-9 py-2.5 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-blue-500/50 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            <FilterChips size="sm" />
          </div>
        </div>

        {/* ─── Desktop search + chips ────────────────────────────── */}
        <div className="hidden md:block px-6 max-w-7xl mx-auto mb-12">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 via-amber-500/10 via-green-500/10 to-blue-500/10 blur-3xl opacity-40" />
            <div className="relative flex items-center gap-3 bg-gray-900/40 backdrop-blur-xl border border-gray-800/50 rounded-2xl p-1.5">
              <div className="relative flex-1">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 via-amber-500/20 via-green-500/20 to-blue-500/20 rounded-xl blur-sm opacity-0 transition-opacity duration-300 group-focus-within:opacity-100" />
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none z-10" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search case studies…"
                  className="w-full bg-gray-900/60 backdrop-blur-sm border border-gray-800/50 rounded-xl pl-11 pr-10 py-3 text-gray-400 placeholder-gray-400 text-sm focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all relative z-10"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors z-10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <div className="flex items-center gap-2">
                <FilterChips size="md" />
              </div>
            </div>
          </div>
        </div>

        {/* ─── Empty state ───────────────────────────────────────── */}
        <AnimatePresence>
          {filteredStudies.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 px-6 text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-gray-800/50 border border-gray-700/50 flex items-center justify-center mb-4">
                <Search className="w-7 h-7 text-gray-500" />
              </div>
              <p className="text-gray-300 font-semibold mb-1">No results found</p>
              <p className="text-gray-500 text-sm">Try adjusting your search or filter.</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ─── Mobile carousel ───────────────────────────────────── */}
        {filteredStudies.length > 0 && (
          <div className="block md:hidden pb-8">
            <div
              ref={containerRef}
              className="overflow-x-auto snap-x snap-mandatory scrollbar-hide px-4"
              style={{
                WebkitOverflowScrolling: 'touch',
                touchAction: 'pan-x',
                msOverflowStyle: 'none',
                scrollbarWidth: 'none',
              }}
            >
              <div className="flex gap-4">
                {filteredStudies.map((study, index) => (
                  <div
                    key={`${study.title}-${index}`}
                    className="w-[88vw] max-w-[340px] flex-shrink-0 snap-center"
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

            <div className="mt-6 flex items-center justify-center gap-6 px-4">
              <button
                onClick={() => scrollToIndex(currentIndex - 1)}
                disabled={currentIndex === 0}
                className="w-10 h-10 rounded-xl border border-gray-700/60 bg-gray-900/50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2">
                {filteredStudies.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => scrollToIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === currentIndex ? 'w-5 bg-blue-400' : 'w-1.5 bg-gray-600'
                    }`}
                    aria-label={`Go to slide ${i + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => scrollToIndex(currentIndex + 1)}
                disabled={currentIndex === filteredStudies.length - 1}
                className="w-10 h-10 rounded-xl border border-gray-700/60 bg-gray-900/50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ─── Desktop grid ──────────────────────────────────────── */}
        {filteredStudies.length > 0 && (
          <div className="hidden md:block px-6 pb-20 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {filteredStudies.map((study, index) => (
                <CaseStudyCard
                  key={`${study.title}-${index}`}
                  study={study}
                  index={index}
                  onSelect={() => setSelectedStudy(study)}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      <CaseStudyModal
        study={selectedStudy}
        isOpen={Boolean(selectedStudy)}
        onClose={() => setSelectedStudy(null)}
      />
    </>
  );
};

export default CaseStudies;
