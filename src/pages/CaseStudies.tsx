'use client';

import React, { useState, useRef, useMemo, useEffect, useCallback, useLayoutEffect } from 'react';
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
  const containerRef = useRef<HTMLDivElement>(null);

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
    (url: string) => {
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
      left: clamped * containerRef.current.offsetWidth,
      behavior: 'smooth',
    });
    setCurrentIndex(clamped);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const idx = Math.round(el.scrollLeft / el.offsetWidth);
      setCurrentIndex(Math.max(0, Math.min(idx, filteredStudies.length - 1)));
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [filteredStudies.length]);

  useEffect(() => {
    setCurrentIndex(0);
    containerRef.current?.scrollTo({ left: 0, behavior: 'auto' });
  }, [filteredStudies]);

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
      <header className="block md:hidden fixed top-4 left-0 right-0 z-50">
        <nav className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6 sm:px-8">
          {/* Logo */}
          <Link to="/" className="flex items-center focus:outline-none">
            <Logo />
          </Link>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
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
              {/* Close Button */}
              <button
                onClick={() => setIsMenuOpen(false)}
                aria-label="Close menu"
                className="absolute top-6 right-6 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors min-w-[44px] min-h-[44px]"
              >
                <X className="w-6 h-6 text-white" />
              </button>

              {/* Nav Items */}
              <div className="flex flex-col space-y-4 pt-20 h-full justify-start">
                {navItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => handleNavigation(item.url)}
                    className="text-lg font-medium text-left py-3 px-4 rounded-lg transition-colors min-h-[48px] text-gray-400 hover:text-white hover:bg-white/5"
                  >
                    {item.name}
                  </button>
                ))}

                <motion.button
                  onClick={handleBookCall}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow hover:shadow-purple-500/25 transition-all min-h-[48px]"
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

            {/* Carousel nav */}
            <div className="flex justify-center items-center mt-6 gap-4 px-4">
              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => scrollToIndex(currentIndex - 1)}
                disabled={currentIndex === 0}
                className="w-11 h-11 rounded-full bg-gray-900/60 border border-gray-800/50 flex items-center justify-center disabled:opacity-30 transition-opacity"
              >
                <ChevronLeft className="w-5 h-5 text-gray-400" />
              </motion.button>

              <div className="flex gap-2">
                {filteredStudies.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToIndex(index)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      index === currentIndex
                        ? 'w-6 bg-blue-500'
                        : 'w-2 bg-gray-700'
                    }`}
                  />
                ))}
              </div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => scrollToIndex(currentIndex + 1)}
                disabled={currentIndex === filteredStudies.length - 1}
                className="w-11 h-11 rounded-full bg-gray-900/60 border border-gray-800/50 flex items-center justify-center disabled:opacity-30 transition-opacity"
              >
                <ChevronRight className="w-5 h-5 text-gray-400" />
              </motion.button>
            </div>
          </div>
        )}

        {/* ─── Tablet grid ───────────────────────────────────────── */}
        {filteredStudies.length > 0 && (
          <div className="hidden md:grid lg:hidden grid-cols-2 gap-6 px-6 max-w-7xl mx-auto">
            {filteredStudies.map((study, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                onClick={() => setSelectedStudy(study)}
                className="group cursor-pointer relative"
              >
                <div className="relative overflow-hidden rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 hover:border-gray-700/80 transition-all duration-300 h-full flex flex-col">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden flex-shrink-0">
                    <img
                      src={study.image}
                      alt={study.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/30 to-transparent" />
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                      <span
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-gradient-to-r ${study.gradient} text-white shadow-sm`}
                      >
                        {study.deployedPlatform}
                      </span>
                      <span className="text-xs text-gray-300 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-gray-700/50">
                        {study.industry}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`w-9 h-9 rounded-xl bg-gradient-to-r ${study.gradient} p-[1px] shrink-0`}
                      >
                        <div className="w-full h-full rounded-xl bg-gray-900 flex items-center justify-center">
                          <study.icon className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <h3
                        className={`text-base font-bold bg-gradient-to-r ${study.gradient} bg-clip-text text-transparent leading-snug`}
                      >
                        {study.title}
                      </h3>
                    </div>

                    <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-2">
                      {study.description}
                    </p>

                    <div className="grid grid-cols-2 gap-2 mt-auto mb-4">
                      {Object.entries(study.metrics).slice(0, 4).map(([key, value]) => (
                        <div
                          key={key}
                          className="bg-gray-800/40 rounded-xl p-3 border border-gray-700/30"
                        >
                          <p
                            className={`text-base font-bold bg-gradient-to-r ${study.gradient} bg-clip-text text-transparent`}
                          >
                            {value}
                          </p>
                          <p className="text-gray-500 text-xs mt-0.5 leading-tight">{key}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center gap-1 text-sm font-semibold text-blue-400">
                      View Case Study
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>

                {/* Card glow */}
                <div
                  className={`absolute -inset-1 bg-gradient-to-r ${study.gradient} rounded-3xl opacity-0 group-hover:opacity-10 blur-xl -z-10 transition-opacity duration-500`}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* ─── Desktop alternating layout ────────────────────────── */}
        {filteredStudies.length > 0 && (
          <div className="hidden lg:block px-6 xl:px-8 max-w-7xl mx-auto">
            <div className="space-y-8">
              {filteredStudies.map((study, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 32 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: 0.05 }}
                  onClick={() => setSelectedStudy(study)}
                  className="group cursor-pointer relative"
                >
                  <div className="relative overflow-hidden rounded-3xl bg-gray-900/40 backdrop-blur-xl border border-gray-800/50 hover:border-gray-700/70 transition-all duration-500 p-8 xl:p-10">

                    <div className="grid grid-cols-2 gap-10 xl:gap-16 items-center">

                      {/* Image column — alternates sides */}
                      <div className={`relative ${index % 2 === 1 ? 'order-2' : 'order-1'}`}>
                        <div className="relative h-72 xl:h-80 rounded-2xl overflow-hidden">
                          <img
                            src={study.image}
                            alt={study.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            loading="lazy"
                          />
                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                          {/* Top-left subtle gradient tint matching study colour */}
                          <div
                            className={`absolute inset-0 bg-gradient-to-br ${study.gradient} opacity-[0.12]`}
                          />

                          {/* Badges */}
                          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                            <span
                              className={`text-xs font-semibold px-3 py-1.5 rounded-full bg-gradient-to-r ${study.gradient} text-white shadow-md`}
                            >
                              {study.deployedPlatform}
                            </span>
                            <span className="text-xs text-gray-200 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10">
                              {study.client}
                            </span>
                          </div>
                        </div>

                        {/* Image glow */}
                        <div
                          className={`absolute -inset-1 bg-gradient-to-r ${study.gradient} rounded-3xl opacity-0 group-hover:opacity-[0.18] blur-xl -z-10 transition-opacity duration-700`}
                        />
                      </div>

                      {/* Content column */}
                      <div className={`relative ${index % 2 === 1 ? 'order-1' : 'order-2'}`}>

                        {/* Giant watermark index - always on right side */}
                        <div className="absolute -top-2 right-6 text-[160px] xl:text-[200px] font-black text-white/[0.025] leading-none select-none pointer-events-none">
                          {String(index + 1).padStart(2, '0')}
                        </div>

                        {/* Icon + industry */}
                        <div className="flex items-center gap-3 mb-5 relative z-10">
                          <div
                            className={`w-12 h-12 rounded-xl bg-gradient-to-r ${study.gradient} p-[1px] shrink-0 group-hover:scale-110 transition-transform duration-300`}
                          >
                            <div className="w-full h-full rounded-xl bg-gray-900 flex items-center justify-center">
                              <study.icon className="w-6 h-6 text-white" />
                            </div>
                          </div>
                          <span className="text-gray-400 text-xs uppercase tracking-widest font-medium">
                            {study.industry}
                          </span>
                        </div>

                        <h3
                          className={`text-2xl xl:text-3xl font-bold bg-gradient-to-r ${study.gradient} bg-clip-text text-transparent mb-4 leading-tight`}
                        >
                          {study.title}
                        </h3>

                        <p className="text-gray-300 text-sm xl:text-base leading-relaxed mb-7">
                          {study.description}
                        </p>

                        {/* Metrics 2×2 */}
                        <div className="grid grid-cols-2 gap-3 mb-7">
                          {Object.entries(study.metrics).map(([key, value]) => (
                            <div
                              key={key}
                              className="bg-gray-800/40 rounded-xl p-3.5 border border-gray-700/30 group-hover:border-gray-600/50 transition-colors duration-300"
                            >
                              <p
                                className={`text-xl font-bold bg-gradient-to-r ${study.gradient} bg-clip-text text-transparent`}
                              >
                                {value}
                              </p>
                              <p className="text-gray-500 text-xs mt-1 leading-snug">{key}</p>
                            </div>
                          ))}
                        </div>

                        {/* CTA */}
                        <span
                          className={`inline-flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-xl bg-gradient-to-r ${study.gradient} text-white text-sm font-semibold shadow-md group-hover:shadow-lg transition-all duration-300`}
                        >
                          View Full Case Study
                          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card glow */}
                  <div
                    className={`absolute -inset-2 bg-gradient-to-r ${study.gradient} rounded-[32px] opacity-0 group-hover:opacity-[0.05] blur-2xl -z-10 transition-opacity duration-700`}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* ─── Bottom CTA ────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 mb-8 mx-4 md:mx-6 xl:mx-auto max-w-7xl"
        >
          <div className="relative overflow-hidden rounded-3xl border border-blue-500/20 p-8 md:p-16 text-center">
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,rgba(59,130,246,0.12),transparent)]" />

            <div className="relative z-10">
              <div className="inline-flex mb-5 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-500/20">
                <span className="text-blue-400 text-sm font-medium flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Ready to Write Your Story?
                </span>
              </div>

              <h2 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight">
                Let's Build Something{' '}
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Remarkable
                </span>
              </h2>

              <p className="text-gray-400 max-w-xl mx-auto mb-8 text-sm md:text-base leading-relaxed">
                Join the businesses that have already transformed with Two Steps. Your success story starts with a single conversation.
              </p>

              <motion.button
                onClick={handleBookCall}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative group min-h-[48px] px-8 rounded-xl font-bold overflow-hidden shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 text-sm md:text-base"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:from-blue-500 group-hover:to-purple-500 transition-colors" />
                <span className="relative flex items-center gap-2 text-white">
                  Book a Free Call
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </motion.button>
            </div>
          </div>
        </motion.section>

      </main>

      {/* Modal */}
      <CaseStudyModal
        study={selectedStudy ?? undefined}
        isOpen={!!selectedStudy}
        onClose={() => setSelectedStudy(null)}
        onBookCall={handleBookCall}
      />
    </>
  );
};

export default CaseStudies;
