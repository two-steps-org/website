'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence, LazyMotion, domAnimation } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import Logo from '../Logo';
import { cn } from '../../lib/utils';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { name: 'Home', url: '#home' },
  { name: 'Services', url: '#services' },
  { name: 'Why Us', url: '#why-us' },
  { name: 'Process', url: '#process' },
  { name: 'Team', url: '#team' },
  { name: 'Q&A', url: '#faq' },
  { name: 'Case Studies', url: '/case-studies' },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(navItems[0].name);
  const manualNavLockRef = useRef(false);
  const manualNavTimerRef = useRef<number | null>(null);

  const releaseManualNav = useCallback((delay = 0) => {
    if (manualNavTimerRef.current) {
      window.clearTimeout(manualNavTimerRef.current);
    }

    manualNavTimerRef.current = window.setTimeout(() => {
      manualNavLockRef.current = false;
    }, delay);
  }, []);

  useEffect(() => {
    return () => {
      if (manualNavTimerRef.current) {
        window.clearTimeout(manualNavTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (location.pathname === '/') return;

    const matched = navItems.find((item) => item.url === location.pathname);
    if (matched) {
      setActiveTab(matched.name);
    } else {
      setActiveTab(navItems[0].name);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== '/') return;

    let ticking = false;

    const updateActiveFromScroll = () => {
      if (manualNavLockRef.current) return;

      const sections = navItems
        .filter((i) => i.url.startsWith('#'))
        .map((i) => {
          const el = document.getElementById(i.url.slice(1));
          return { ...i, element: el };
        })
        .filter((s) => s.element) as Array<{ name: string; url: string; element: HTMLElement }>;

      if (!sections.length) return;

      // Switch at section start: as soon as the section's top crosses the
      // fixed-navbar line, mark it active.
      const navOffset = 96;
      const triggerY = window.scrollY + navOffset;
      let active = sections[0];

      for (const section of sections) {
        const sectionTop = section.element.getBoundingClientRect().top + window.scrollY;
        if (sectionTop <= triggerY) {
          active = section;
        } else {
          break;
        }
      }

      setActiveTab((prev) => (prev === active.name ? prev : active.name));
    };

    const onScrollOrResize = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        updateActiveFromScroll();
        ticking = false;
      });
    };

    updateActiveFromScroll();
    const t1 = window.setTimeout(updateActiveFromScroll, 120);
    const t2 = window.setTimeout(updateActiveFromScroll, 400);

    const onNavForceLoad = () => onScrollOrResize();

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
    window.addEventListener('navForceLoad', onNavForceLoad);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
      window.removeEventListener('navForceLoad', onNavForceLoad);
    };
  }, [location.pathname]);

  const handleNavigation = useCallback(
    (url: string, name: string) => {
      manualNavLockRef.current = true;
      setActiveTab(name);
      setIsMenuOpen(false);

      if (!url.startsWith('#')) {
        navigate(url);
        if (url === '/case-studies') {
          window.scrollTo({ top: 0, behavior: 'auto' });
        }
        releaseManualNav(250);
        return;
      }

      const sectionId = url.slice(1);

      // Force all lazy sections to render immediately (so their real heights
      // are in the DOM), then poll until the page height stops changing before
      // doing a single smooth scroll. This prevents the visible "wrong section
      // first, then jump" caused by placeholder divs being 200px each.
      const scrollWhenStable = () => {
        window.dispatchEvent(new CustomEvent('navForceLoad'));

        let lastScrollHeight = document.body.scrollHeight;
        let stableCount = 0;
        let attempts = 0;

        const poll = () => {
          const currentScrollHeight = document.body.scrollHeight;
          attempts++;

          if (currentScrollHeight !== lastScrollHeight) {
            stableCount = 0; // sections are still expanding
          } else {
            stableCount++;
          }
          lastScrollHeight = currentScrollHeight;

          // stableCount >= 4 means 200ms of no layout change → sections settled.
          // Fall back after 3 seconds (60 × 50ms) so we always scroll eventually.
          if (stableCount >= 4 || attempts >= 60) {
            const el = document.getElementById(sectionId);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            releaseManualNav(1200);
          } else {
            setTimeout(poll, 50);
          }
        };

        // Two rAF passes let React flush the navForceLoad state updates to the DOM
        // before we start measuring heights.
        requestAnimationFrame(() => requestAnimationFrame(poll));
      };

      if (location.pathname !== '/') {
        navigate('/', { state: { targetSection: sectionId, isSectionNav: true } });
        releaseManualNav(300);
      } else {
        scrollWhenStable();
      }
    },
    [navigate, location.pathname, releaseManualNav],
  );

  const handleBookCall = useCallback(() => {
    window.open('https://calendly.com/yoni-insell-twosteps/30min', '_blank');
    setIsMenuOpen(false);
  }, []);

  return (
    <header className="fixed top-4 left-0 right-0 z-50">
      <nav className="max-w-7xl mx-auto flex items-center justify-between h-16 lg:h-16 px-6 sm:px-8">
        {/* Logo */}
        <button
          onClick={() => handleNavigation('#home', 'Home')}
          aria-label="Go to Home"
          className="flex items-center focus:outline-none"
        >
          <Logo />
        </button>

        {/* Desktop Nav */}
        <div className="hidden lg:flex flex-1 justify-center">
          <div className="flex items-center gap-6 bg-gray-900/50 border border-gray-800/50 backdrop-blur-lg py-2 px-2 rounded-full shadow-lg">
            {navItems.map((item) => {
              const isActive = activeTab === item.name;
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.url, item.name)}
                  className={cn(
                    'relative cursor-pointer text-sm font-semibold px-4 py-2 rounded-full transition-colors min-h-[44px]',
                    'text-gray-400 hover:text-white',
                    isActive && 'text-white',
                  )}
                >
                  <span className="hidden md:inline">{item.name}</span>
                  {isActive && (
                    <motion.div
                      layoutId="lamp"
                      className="absolute inset-0 w-full bg-blue-500/5 rounded-full -z-10"
                      initial={false}
                      transition={{ type: 'tween', duration: 0.08, ease: 'easeOut' }}
                    >
                      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-blue-500 rounded-t-full">
                        <div className="absolute w-12 h-6 bg-blue-500/20 rounded-full blur-md -top-2 -left-2" />
                        <div className="absolute w-8 h-6 bg-blue-500/20 rounded-full blur-md -top-1" />
                        <div className="absolute w-4 h-4 bg-blue-500/20 rounded-full blur-sm top-0 left-2" />
                      </div>
                    </motion.div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* CTA (Desktop) */}
        <div className="hidden lg:flex">
          <motion.button
            onClick={handleBookCall}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-lg text-sm font-medium shadow hover:shadow-blue-500/25 transition-all flex items-center gap-2"
          >
            Book a Call
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          className="lg:hidden p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors min-w-[44px] min-h-[44px]"
        >
          {isMenuOpen ? (
            <X className="w-6 h-6 text-white" />
          ) : (
            <Menu className="w-6 h-6 text-white" />
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      <LazyMotion features={domAnimation}>
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
                      onClick={() => handleNavigation(item.url, item.name)}
                      className={`text-lg font-medium text-left py-3 px-4 rounded-lg transition-colors min-h-[48px] ${
                        activeTab === item.name ? 'text-white bg-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      {item.name}
                      {activeTab === item.name && (
                        <div className="w-6 h-1 bg-blue-500 rounded-full mt-1">
                          <div className="absolute w-12 h-6 bg-blue-500/20 rounded-full blur-md -top-2 -left-2" />
                          <div className="absolute w-8 h-6 bg-blue-500/20 rounded-full blur-md -top-1" />
                          <div className="absolute w-4 h-4 bg-blue-500/20 rounded-full blur-sm top-0 left-2" />
                        </div>
                      )}
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
      </LazyMotion>
    </header>
  );
};

export default Navbar;
