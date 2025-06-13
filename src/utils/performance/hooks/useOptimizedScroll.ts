import { useEffect, useRef, useCallback } from 'react';

export function useOptimizedScroll(
  callback: (scrollY: number) => void,
  wait = 16 // ~1 frame at 60fps
) {
  const frame = useRef<number>();
  const lastScrollY = useRef(window.scrollY);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;

  const handleScroll = useCallback(() => {
    if (frame.current) {
      cancelAnimationFrame(frame.current);
    }

    frame.current = requestAnimationFrame(() => {
      const currentScrollY = window.scrollY;
      if (Math.abs(currentScrollY - lastScrollY.current) > 5) {
        callbackRef.current(currentScrollY);
        lastScrollY.current = currentScrollY;
      }
    });
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (frame.current) {
        cancelAnimationFrame(frame.current);
      }
    };
  }, [handleScroll]);
}