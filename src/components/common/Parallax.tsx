import React, { useRef } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';
import { useReducedMotionQuery } from '../../utils/scroll';

interface ParallaxProps {
  children: React.ReactNode;
  className?: string;
  distance?: number;
  fadeTo?: number;
}

/** Scroll-linked Y drift. Opacity scrub only when fadeTo is below 1. */
const Parallax: React.FC<ParallaxProps> = ({ children, className, distance = 80, fadeTo = 1 }) => {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotionQuery();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [-distance / 2, distance / 2]);
  const opacity = useTransform(scrollYProgress, [0.5, 1], [1, fadeTo]);

  const style =
    reduce
      ? undefined
      : fadeTo < 1
        ? { y, opacity }
        : { y };

  return (
    <m.div ref={ref} className={className} style={style}>
      {children}
    </m.div>
  );
};

export default React.memo(Parallax);
