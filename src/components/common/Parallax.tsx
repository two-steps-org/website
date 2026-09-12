import React, { useRef } from 'react';
import { m, useReducedMotion, useScroll, useTransform } from 'framer-motion';

interface ParallaxProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Total travel in px across the element's pass through the viewport.
   * Positive moves the content down as you scroll (it lags the page);
   * negative moves it up (it leads). Keep it small: 40–120.
   */
  distance?: number;
}

/**
 * Scroll-linked drift. The child moves slower than the page, which is what
 * gives depth to hero imagery and large panels. Transform-only, so it stays on
 * the compositor; reduced motion pins it.
 */
const Parallax: React.FC<ParallaxProps> = ({ children, className, distance = 80 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-distance / 2, distance / 2]);

  return (
    <m.div ref={ref} className={className} style={reduce ? undefined : { y }}>
      {children}
    </m.div>
  );
};

export default React.memo(Parallax);
