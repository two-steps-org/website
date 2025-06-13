import { useState, useEffect } from 'react';
import { breakpoints, type Breakpoint } from '../breakpoints';

export function useBreakpoint() {
  const [currentBreakpoint, setCurrentBreakpoint] = useState<Breakpoint>('lg');

  useEffect(() => {
    let timeoutId: number;

    function getBreakpoint(): Breakpoint {
      const width = Math.max(window.innerWidth, breakpoints.lg);
      if (width >= breakpoints['2xl']) return '2xl';
      if (width >= breakpoints.xl) return 'xl';
      return 'lg';
    }

    function handleResize() {
      // Debounce resize events
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        setCurrentBreakpoint(getBreakpoint());
      }, 100);
    }

    // Set initial breakpoint
    setCurrentBreakpoint(getBreakpoint());
    
    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return currentBreakpoint;
}