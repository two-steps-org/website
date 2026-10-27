import { useState, useEffect, useCallback, useRef, type MouseEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { navItems } from '../../data/navItems';
import { useBookCall } from '../BookCall/useBookCall';

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
  const { open: openBookCall } = useBookCall();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showMobileContrastBar, setShowMobileContrastBar] = useState(false);
  // '' = nothing lit: on the hero, or in a section the desktop pill doesn't list.
  const [activeTab, setActiveTab] = useState('');
  const [isOverLightBand, setIsOverLightBand] = useState(false);
  const manualNavLockRef = useRef(false);
  const manualNavTimerRef = useRef<number | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);

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
          const offset = getNavScrollOffset();
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
    const path = normalizePath(location.pathname);
    const matched = navItems.find((item) => !item.url.includes('#') && (path === item.url || path.startsWith(`${item.url}/`)));
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
      if (rafId) window.cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [location.pathname]);

  const handleBookCall = useCallback(() => {
    openBookCall();
    setIsMenuOpen(false);
  }, [openBookCall]);

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

  return {
    headerRef,
    isMenuOpen,
    setIsMenuOpen,
    showMobileContrastBar,
    activeTab,
    isOverLightBand,
    handleNavigation,
    handleBookCall,
  };
}
