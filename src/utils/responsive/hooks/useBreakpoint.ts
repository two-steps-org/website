import { useState, useEffect } from 'react';
import { breakpoints, type Breakpoint } from '../breakpoints';

export function useBreakpoint() {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('lg');

  useEffect(() => {
    let timeoutId: number;

    function getCurrentBreakpoint(): Breakpoint {
      const width = window.innerWidth;
      if (width >= breakpoints['2xl']) return '2xl';
      if (width >= breakpoints.xl) return 'xl';
      if (width >= breakpoints.lg) return 'lg';
      if (width >= breakpoints.md) return 'md';
      if (width >= breakpoints.sm) return 'sm';
      return 'xs';
    }

    function handleResize() {
      // Debounce resize events
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        setCurrentBreakpoint(getCurrentBreakpoint());
      }, 100);
    }

    // Set initial breakpoint
    setCurrentBreakpoint(getCurrentBreakpoint());

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return currentBreakpoint;
}