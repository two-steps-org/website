import { useEffect, useRef } from 'react';
import { TIMING, EASINGS } from './constants';

export const optimizedAnimations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { 
      duration: TIMING.default / 1000,
      ease: EASINGS.default
    }
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: {
      duration: TIMING.default / 1000,
      ease: EASINGS.decelerate
    }
  }
};

export function useOptimizedAnimation(callback: () => void) {
  const frame = useRef<number>();

  useEffect(() => {
    const animate = () => {
      callback();
      frame.current = requestAnimationFrame(animate);
    };

    frame.current = requestAnimationFrame(animate);

    return () => {
      if (frame.current) {
        cancelAnimationFrame(frame.current);
      }
    };
  }, [callback]);
}