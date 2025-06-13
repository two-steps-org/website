import { useEffect, useCallback } from 'react';
import { debounce, throttle } from '../optimizations/codeOptimization';

export function useOptimizedEvents() {
  const handleScroll = useCallback(
    throttle(() => {
      // Scroll handling logic
    }, 16),
    []
  );

  const handleResize = useCallback(
    debounce(() => {
      // Resize handling logic
    }, 100),
    []
  );

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [handleScroll, handleResize]);
}