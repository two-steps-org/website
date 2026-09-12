import React, { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  value: number;
  prefix?: string;
  suffix?: string;
  /** Total animation time in ms. */
  duration?: number;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Counts from zero to `value` on mount.
 *
 * The design drives these from an IntersectionObserver, but every place we use
 * one is inside a modal that mounts already in view, so mount is the same
 * moment and needs no observer. Reduced motion renders the final value with no
 * animation, per the brief's acceptance criteria.
 */
const CountUp: React.FC<CountUpProps> = ({ value, prefix = '', suffix = '', duration = 1400 }) => {
  const [display, setDisplay] = useState(() => (prefersReducedMotion() ? value : 0));
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    if (prefersReducedMotion()) {
      setDisplay(value);
      return;
    }

    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min(1, (now - start) / duration);
      setDisplay(value * easeOutCubic(progress));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    };

    frameRef.current = requestAnimationFrame(tick);
    return () => {
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    };
  }, [value, duration]);

  return (
    <>
      {prefix}
      {Math.round(display).toLocaleString('en-GB')}
      {suffix}
    </>
  );
};

export default CountUp;
