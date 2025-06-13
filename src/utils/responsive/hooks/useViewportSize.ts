import { useState, useEffect } from 'react';
import { breakpoints } from '../breakpoints';

export function useViewportSize() {
  const [size, setSize] = useState({
    width: Math.max(window.innerWidth, breakpoints.lg),
    height: window.innerHeight
  });

  useEffect(() => {
    let timeoutId: number;

    const handleResize = () => {
      // Debounce resize events
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        setSize({
          width: Math.max(window.innerWidth, breakpoints.lg),
          height: window.innerHeight
        });
      }, 100);
    };

    window.addEventListener('resize', handleResize, { passive: true });
    return () => {
      window.removeEventListener('resize', handleResize);
      clearTimeout(timeoutId);
    };
  }, []);

  return size;
}