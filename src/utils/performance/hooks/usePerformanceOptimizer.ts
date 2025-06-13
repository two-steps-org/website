import { useEffect, useCallback } from 'react';
import { useAnimationOptimizer } from './useAnimationOptimizer';
import { debounce, throttle } from '../optimizations/codeOptimization';

export function usePerformanceOptimizer() {
  // Animation optimizations
  useAnimationOptimizer();

  // Optimized event handlers
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
    // Optimize images
    document.querySelectorAll('img').forEach(img => {
      if (!img.loading) img.loading = 'lazy';
      if (!img.decoding) img.decoding = 'async';
    });

    // Optimize event listeners
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });
    
    const passiveEvents = ['touchstart', 'touchmove', 'wheel'];
    passiveEvents.forEach(event => {
      window.addEventListener(event, () => {}, { passive: true });
    });

    // Optimize font loading
    if ('fonts' in document) {
      document.fonts.ready.then(() => {
        document.documentElement.classList.add('fonts-loaded');
      });
    }

    // Disable animations when window is not visible
    const handleVisibilityChange = () => {
      document.documentElement.style.setProperty(
        '--animation-duration',
        document.hidden ? '0s' : 'var(--animation-duration-default)'
      );
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [handleScroll, handleResize]);
}