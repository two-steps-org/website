import { useContext, type ReactNode } from 'react';
import { m, useMotionValue, useTransform } from 'framer-motion';
import { ScrollProgressContext, useReducedMotionQuery } from '../../utils/scroll';

/** Detail motion shares its card's progress: no extra scroll measurement or timer. */
export default function ScrollAccent({ children, className, delay = 0, x = 0 }: {
  children: ReactNode;
  className?: string;
  delay?: number;
  x?: number;
}) {
  const parent = useContext(ScrollProgressContext);
  const visible = useMotionValue(1);
  const reduce = useReducedMotionQuery();
  const progress = useTransform(parent ?? visible, [delay, 1], [0, 1]);
  const transform = useTransform(progress, value => value >= 1 ? 'none'
    : `translate(${x * (1 - value)}px, ${8 * (1 - value)}px) scale(${0.92 + 0.08 * value})`);
  const opacity = useTransform(progress, [0, 1], [0.25, 1]);

  return <m.div className={className} data-scroll-accent="icon"
    style={reduce ? undefined : { transform, opacity }}>{children}</m.div>;
}
