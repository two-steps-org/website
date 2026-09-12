'use client';

import { useState, useEffect, useCallback, useRef, type MouseEvent } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import clsx from 'clsx';
import Logo from '../Logo';
import { useLocation, useNavigate } from 'react-router-dom';
import { BOOK_CALL_URL, navItems } from '../../data/navItems';

const NAV_SCROLL_OFFSET_DESKTOP = 96;
const NAV_SCROLL_OFFSET_MOBILE = 72;
const normalizePath = (path: string) => (path.length > 1 ? path.replace(/\/+$/, '') : path);

const getNavScrollOffset = () =>
  window.matchMedia('(max-width: 1023px)').matches
    ? NAV_SCROLL_OFFSET_MOBILE
    : NAV_SCROLL_OFFSET_DESKTOP;

const NavbarMobileMenu = ({
  isMenuOpen, setIsMenuOpen, activeTab, handleNavigation, handleBookCall,
}: {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
  activeTab: string;
  handleNavigation: (url: string, name: string, event?: MouseEvent<HTMLAnchorElement>) => void;
  handleBookCall: () => void;
}) => (
  <AnimatePresence>
    {isMenuOpen && (
      <>
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-bg z-40 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />

        <m.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="fixed inset-y-0 right-0 w-full h-full bg-bg px-6 pb-6 flex flex-col z-50 lg:hidden"
          style={{
            paddingTop: 'max(1.5rem, env(safe-area-inset-top))',
            paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))',
          }}
        >
          <div className="flex items-center justify-between">
            <a
              href="/#home"
              onClick={(event) => handleNavigation('/#home', 'Home', event)}
              aria-label="Go to Home"
              className="flex items-center focus:outline-none"
            >
              <Logo />
            </a>

            <button
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
              className="flex items-center justify-center min-w-[44px] min-h-[44px] rounded-full border border-line-strong text-ink transition-colors hover:bg-surface"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Oversized type, hairline rules — the design's full-screen menu. */}
          <div className="mt-10 flex-1 min-h-0 flex flex-col justify-between">
            <ul className="list-none m-0 p-0 flex flex-col">
              {navItems.map((item) => (
                <li key={item.name} className="border-b border-line">
                  <a
                    href={item.url}
                    onClick={(event) => handleNavigation(item.url, item.name, event)}
                    className={clsx(
                      'block py-5 text-[28px] font-medium tracking-[-0.03em] transition-colors',
                      activeTab === item.name ? 'text-ink' : 'text-muted hover:text-ink',
                    )}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>

            <button
              onClick={handleBookCall}
              className="ts-pill mt-8 w-full h-14 text-base"
            >
              Book a Call
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </m.div>
      </>
    )}
  </AnimatePresence>
);

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(navItems[0].name);
  const [isOverLightBand, setIsOverLightBand] = useState(false);
  const manualNavLockRef = useRef(false);
  const manualNavTimerRef = useRef<number | null>(null);

  const unlockManualNav = useCallback((delay = 600) => {
    if (manualNavTimerRef.current) window.clearTimeout(manualNavTimerRef.current);
    manualNavTimerRef.current = window.setTimeout(() => {
      manualNavLockRef.current = false;
    }, delay);
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    const startedAt = Date.now();

    const attempt = () => {
      const el = document.getElementById(sectionId);
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - getNavScrollOffset();
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        unlockManualNav(800);
        return;
      }
      if (Date.now() - startedAt < 2200) {
        window.setTimeout(attempt, 80);
        return;
      }
      manualNavLockRef.current = false;
    };

    attempt();
  }, [unlockManualNav]);

  useEffect(() => () => {
    if (manualNavTimerRef.current) window.clearTimeout(manualNavTimerRef.current);
  }, []);

  useEffect(() => {
    if (normalizePath(location.pathname) === '/') return;
    const matched = navItems.find((item) => normalizePath(item.url) === normalizePath(location.pathname));
    setActiveTab(matched?.name ?? navItems[0].name);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname !== '/') return;

    let ticking = false;
    const updateActiveFromScroll = () => {
      if (manualNavLockRef.current) return;

      const sections = navItems
        .filter((item) => item.url.includes('#'))
        .map((item) => {
          const sectionId = item.url.split('#')[1];
          const element = sectionId ? document.getElementById(sectionId) : null;
          return element ? { name: item.name, element } : null;
        })
        .filter(Boolean) as Array<{ name: string; element: HTMLElement }>;

      if (!sections.length) return;

      const triggerY = window.scrollY + getNavScrollOffset();
      let active = sections[0];
      for (const section of sections) {
        const sectionTop = section.element.getBoundingClientRect().top + window.scrollY;
        if (sectionTop <= triggerY) active = section;
        else break;
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
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [location.pathname]);

  const handleNavigation = useCallback(
    (url: string, name: string, event?: MouseEvent<HTMLAnchorElement>) => {
      manualNavLockRef.current = true;
      setActiveTab(name);
      setIsMenuOpen(false);
      event?.preventDefault();

      if (!url.includes('#')) {
        navigate(url);
        if (url === '/case-studies') window.scrollTo({ top: 0, behavior: 'auto' });
        unlockManualNav(250);
        return;
      }

      const sectionId = url.split('#')[1];
      if (!sectionId) return;

      if (location.pathname !== '/') {
        navigate('/', { state: { targetSection: sectionId, isSectionNav: true } });
        unlockManualNav(1200);
        return;
      }

      scrollToSection(sectionId);
    },
    [location.pathname, navigate, scrollToSection, unlockManualNav],
  );

  useEffect(() => {
    if (!isMenuOpen || !window.matchMedia('(max-width: 1023px)').matches) return;

    const { body, documentElement: html } = document;
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

  const handleBookCall = useCallback(() => {
    window.open(BOOK_CALL_URL, '_blank', 'noopener,noreferrer');
    setIsMenuOpen(false);
  }, []);

  // Nav duality: the design flips the pill to its light treatment whenever a
  // [data-band="light"] section crosses the nav line, so it stays readable over
  // the #fafafa bands. Mirrors paintNav() in the Claude Design artboard.
  useEffect(() => {
    const NAV_LINE = 44;
    let ticking = false;

    const paintNav = () => {
      const bands = document.querySelectorAll('[data-band="light"]');
      let light = false;
      for (const band of bands) {
        const rect = band.getBoundingClientRect();
        if (rect.top <= NAV_LINE && rect.bottom >= NAV_LINE) {
          light = true;
          break;
        }
      }
      setIsOverLightBand((prev) => (prev === light ? prev : light));
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        paintNav();
        ticking = false;
      });
    };

    paintNav();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [location.pathname]);

  return (
    <>
      <header
      className="fixed top-0 left-0 right-0 z-50 flex justify-center px-mobile pointer-events-none"
      style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))', paddingBottom: '16px' }}
    >
      {/* Centred glass pill. pointer-events are re-enabled on the pill itself so
          the transparent gutter beside it stays click-through. */}
      <nav
        aria-label="Primary"
        className={clsx(
          'pointer-events-auto w-full max-w-[920px] h-[60px] flex items-center justify-between gap-6',
          'rounded-full pl-5 pr-2 shadow-[var(--shadow-sm)] backdrop-blur-[20px]',
          'transition-[background-color,border-color,color] duration-300',
          isOverLightBand
            ? 'bg-[rgba(250,250,250,0.72)] border border-[rgba(0,0,0,0.08)] text-[#0a0a0a]'
            : 'ts-glass text-ink',
        )}
      >
        <a
          href="/#home"
          onClick={(event) => handleNavigation('/#home', 'Home', event)}
          aria-label="Go to Home"
          className="flex items-center focus:outline-none shrink-0"
        >
          <Logo className="h-6" />
        </a>

        <ul className="hidden lg:flex items-center gap-6 list-none m-0 p-0">
          {navItems.map((item) => (
            <li key={item.name}>
              <a
                href={item.url}
                onClick={(event) => handleNavigation(item.url, item.name, event)}
                className={clsx(
                  'inline-flex items-center min-h-[44px] text-sm font-medium transition-colors',
                  isOverLightBand
                    ? activeTab === item.name
                      ? 'text-[#0a0a0a]'
                      : 'text-[#6b6b6b] hover:text-[#0a0a0a]'
                    : activeTab === item.name
                      ? 'text-ink'
                      : 'text-muted hover:text-ink',
                )}
              >
                {item.name}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            onClick={handleBookCall}
            className={clsx(
              'ts-pill hidden lg:inline-flex h-11 px-[18px] text-sm',
              isOverLightBand && 'bg-[#0a0a0a] text-white',
            )}
          >
            Book a Call
          </button>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isMenuOpen}
            className={clsx(
              'lg:hidden flex items-center justify-center w-11 h-11 rounded-full border transition-colors',
              isOverLightBand
                ? 'border-[rgba(0,0,0,0.16)] text-[#0a0a0a] hover:bg-black/5'
                : 'border-line-strong text-ink hover:bg-surface',
            )}
          >
            {isMenuOpen ? <X className="w-[18px] h-[18px]" /> : <Menu className="w-[18px] h-[18px]" />}
          </button>
        </div>
      </nav>
      </header>

      {/* Sits outside the header: the header is pointer-events-none so the
          gutter beside the pill stays click-through, and the menu must not
          inherit that. */}
      <NavbarMobileMenu
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        activeTab={activeTab}
        handleNavigation={handleNavigation}
        handleBookCall={handleBookCall}
      />
    </>
  );
};

export default Navbar;
