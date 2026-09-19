import { useState, useEffect, useCallback, useRef, type MouseEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { BOOK_CALL_URL, navItems } from '../../data/navItems';

const NAV_SCROLL_OFFSET_DESKTOP = 96;
const NAV_SCROLL_OFFSET_MOBILE = 72;
const normalizePath = (path: string) => (path.length > 1 ? path.replace(/\/+$/, '') : path);

const getNavScrollOffset = () =>
  window.matchMedia('(max-width: 1023px)').matches
    ? NAV_SCROLL_OFFSET_MOBILE
    : NAV_SCROLL_OFFSET_DESKTOP;

export type NavbarNavigate = (
  url: string,
  name: string,
  event?: MouseEvent<HTMLAnchorElement>,
) => void;

export function useNavbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPastHero, setIsPastHero] = useState(false);
  // '' = nothing lit: on the hero, or in a section the desktop pill doesn't list.
  const [activeTab, setActiveTab] = useState('');
  const [isOverLightBand, setIsOverLightBand] = useState(false);
  const manualNavLockRef = useRef(false);
  const manualNavTimerRef = useRef<number | null>(null);

  const unlockManualNav = useCallback((delay = 600) => {
    if (manualNavTimerRef.current) window.clearTimeout(manualNavTimerRef.current);
    manualNavTimerRef.current = window.setTimeout(() => {
      manualNavLockRef.current = false;
    }, delay);
  }, []);

  const scrollToSection = useCallback(
    (sectionId: string) => {
      const startedAt = Date.now();

      const attempt = () => {
        const el = document.getElementById(sectionId);
        if (el) {
          const offset = el.dataset.pin !== undefined ? 0 : getNavScrollOffset();
          const top = el.getBoundingClientRect().top + window.scrollY - offset;
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
    },
    [unlockManualNav],
  );

  useEffect(
    () => () => {
      if (manualNavTimerRef.current) window.clearTimeout(manualNavTimerRef.current);
    },
    [],
  );

  useEffect(() => {
    if (normalizePath(location.pathname) === '/') return;
    const matched = navItems.find((item) => normalizePath(item.url) === normalizePath(location.pathname));
    setActiveTab(matched?.name ?? '');
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
      let active: (typeof sections)[number] | null = null;
      for (const section of sections) {
        const sectionTop = section.element.getBoundingClientRect().top + window.scrollY;
        if (sectionTop <= triggerY) active = section;
        else break;
      }

      const name = active?.name ?? '';
      setActiveTab((prev) => (prev === name ? prev : name));
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

  const handleNavigation = useCallback<NavbarNavigate>(
    (url, name, event) => {
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

      // Threshold, not a scrub: glass held at partial opacity looks muddy.
      // Pages without a hero get the capsule as soon as they scroll.
      const hero = document.getElementById('home');
      const past = hero ? hero.getBoundingClientRect().bottom <= NAV_LINE : window.scrollY > 8;
      setIsPastHero((prev) => (prev === past ? prev : past));
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

  return {
    isMenuOpen,
    setIsMenuOpen,
    isPastHero,
    activeTab,
    isOverLightBand,
    handleNavigation,
    handleBookCall,
  };
}
