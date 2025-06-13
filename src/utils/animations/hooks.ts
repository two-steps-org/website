import { useEffect, useState, useCallback } from 'react';
import { TIMING } from './constants';

export function useIntersectionObserver(
  options = { threshold: 0.1, rootMargin: '50px' }
) {
  const [ref, setRef] = useState<Element | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsVisible(entry.isIntersecting);
    }, options);

    observer.observe(ref);
    return () => observer.disconnect();
  }, [ref, options.threshold, options.rootMargin]);

  return [setRef, isVisible] as const;
}

export function useScrollDirection() {
  const [scrollDir, setScrollDir] = useState<'up' | 'down'>('up');

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let ticking = false;

    const updateScrollDir = () => {
      const scrollY = window.scrollY;

      if (Math.abs(scrollY - lastScrollY) < 10) {
        ticking = false;
        return;
      }

      setScrollDir(scrollY > lastScrollY ? 'down' : 'up');
      lastScrollY = scrollY > 0 ? scrollY : 0;
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollDir);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return scrollDir;
}

export function useDebouncedCallback<T extends (...args: any[]) => any>(
  callback: T,
  delay: number = TIMING.default
) {
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  return useCallback((...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    
    const newTimeoutId = setTimeout(() => {
      callback(...args);
    }, delay);
    
    setTimeoutId(newTimeoutId);
  }, [callback, delay, timeoutId]);
}