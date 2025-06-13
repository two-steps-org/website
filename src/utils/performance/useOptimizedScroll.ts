import { useEffect, useRef } from 'react';

export function useOptimizedScroll(callback: () => void, delay = 16) {
  const timeoutRef = useRef<number>();
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      lastScrollY.current = window.scrollY;

      if (!ticking.current) {
        window.requestAnimationFrame(() => {
          callback();
          ticking.current = false;
        });

        ticking.current = true;
      }
    };

    // Use passive scroll listener for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [callback]);
}