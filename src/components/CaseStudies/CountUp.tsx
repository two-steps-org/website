import React, { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../../utils/motionPreference';

interface CountUpProps {
  value: number;
  prefix?: string;
  suffix?: string;
  /** Total animation time in ms. */
  duration?: number;
}

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

/** Counts from zero once the outcome figure scrolls into view. */
const CountUp: React.FC<CountUpProps> = ({ value, prefix = '', suffix = '', duration = 1400 }) => {
  const node = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = node.current;
    if (!el) return;
    const write = (next: number) => {
      el.textContent = `${prefix}${Math.round(next).toLocaleString('en-GB')}${suffix}`;
    };
    if (prefersReducedMotion()) {
      write(value);
      return;
    }
    write(0);
    let frame = 0;
    let started = false;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting || started) return;
      started = true;
      observer.disconnect();
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / duration);
        write(value * easeOutCubic(progress));
        if (progress < 1) frame = requestAnimationFrame(tick);
      };
      frame = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value, prefix, suffix, duration]);

  return <span ref={node} />;
};

export default CountUp;
