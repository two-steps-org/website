import React, { useRef } from 'react';
import { m, useInView, useTransform } from 'framer-motion';
import { useReducedMotionQuery, useSectionProgress, ScrollProgressContext } from '../../utils/scroll';

export type ScrollEffect = 'rise' | 'assemble' | 'shutter' | 'focus' | 'timeline' | 'portrait' | 'unfold' | 'curtain' | 'signature';

interface ScrubProps {
  as?: 'div' | 'section' | 'article' | 'li' | 'figure';
  /** Layout belongs to this stationary measuring element. */
  className?: string;
  /** Grid/flex layout for the animated content, when needed. */
  contentClassName?: string;
  children: React.ReactNode;
  effect?: ScrollEffect;
  x?: number;
  y?: number;
  scale?: number;
  opacity?: number;
  /** Scroll stagger, expressed as a fraction of the reveal window. */
  delay?: number;
  endAtBottom?: boolean;
}

const START = {
  rise: { y: 32, scale: 1, opacity: 0.25, rotate: 0 },
  assemble: { y: 48, scale: 0.96, opacity: 0.35, rotate: 3 },
  shutter: { y: 24, scale: 0.96, opacity: 1, rotate: 0 },
  focus: { y: 24, scale: 0.9, opacity: 0.2, rotate: 0 },
  timeline: { y: 0, scale: 1, opacity: 0.2, rotate: 0 },
  portrait: { y: 48, scale: 0.96, opacity: 0.3, rotate: 0 },
  unfold: { y: 20, scale: 1, opacity: 0.2, rotate: 0 },
  curtain: { y: 0, scale: 1, opacity: 0.4, rotate: 0 },
  signature: { y: 32, scale: 1, opacity: 0.35, rotate: 0 },
} as const;

/** A stationary anchor drives an independently painted child. No timers or springs:
 * the same scroll position always produces the same frame, in either direction.
 */
const AnimatedScrub: React.FC<ScrubProps> = ({
  as = 'div', className, contentClassName, children, effect = 'rise',
  x = 0, y, scale, opacity, delay = 0, endAtBottom = false,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const nearViewport = useInView(ref, { margin: '160px' });
  const raw = useSectionProgress(ref, endAtBottom
    ? ['start end', 'end end']
    : ['start 0.94', 'start 0.34']);
  const progress = useTransform(raw, [Math.min(delay, 0.3), 1], [0, 1]);
  const preset = START[effect];
  const direction = x < 0 ? -1 : 1;
  const transform = useTransform(progress, value => {
    const remaining = 1 - value;
    if (remaining < 0.00001) return 'none';
    const mobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const travel = mobile ? 0.55 : 1;
    const tx = x * remaining * travel;
    const ty = (y ?? preset.y) * remaining * travel;
    const sc = 1 - (1 - (scale ?? preset.scale)) * remaining;
    const rotation = effect === 'signature'
      ? `perspective(1000px) rotateX(${18 * remaining * travel}deg)`
      : effect === 'portrait'
      ? `perspective(1000px) rotateY(${direction * 14 * remaining * travel}deg)`
      : `rotate(${preset.rotate * direction * remaining * travel}deg)`;
    return `translate(${tx}px, ${ty}px) ${rotation} scale(${sc})`;
  });
  const alpha = useTransform(progress, [0, 1], [opacity ?? preset.opacity, 1]);
  const clipPath = useTransform(progress, value => {
    const remaining = 1 - value;
    if (effect === 'shutter') return `inset(${12 * remaining}% ${8 * remaining}% round ${24 * remaining}px)`;
    if (effect === 'curtain') return `inset(0 ${48 * remaining}% 0 ${48 * remaining}%)`;
    if (effect === 'unfold') return `inset(0 0 ${90 * remaining}% 0)`;
    if (effect === 'timeline') return x < 0
      ? `inset(0 0 0 ${60 * remaining}%)`
      : `inset(0 ${60 * remaining}% 0 0)`;
    return 'none';
  });
  const Tag = as as 'div';

  return (
    <Tag ref={ref} className={className} data-scroll-reveal={effect}>
      <ScrollProgressContext.Provider value={progress}>
        <m.div
          className={contentClassName}
          data-scroll-motion={effect}
          style={{ transform, opacity: alpha, clipPath, position: 'relative', height: '100%', minHeight: 'inherit', transformOrigin: effect === 'signature' ? 'center bottom' : undefined, willChange: nearViewport ? 'transform, opacity' : undefined }}
        >
          {children}
        </m.div>
      </ScrollProgressContext.Provider>
    </Tag>
  );
};

const Scrub: React.FC<ScrubProps> = props => {
  const reduce = useReducedMotionQuery();
  if (!reduce) return <AnimatedScrub {...props} />;
  const Tag = (props.as ?? 'div') as 'div';
  return (
    <Tag className={props.className} data-scroll-reveal={props.effect ?? 'rise'}>
      <div className={props.contentClassName} style={{ position: 'relative', height: '100%', minHeight: 'inherit' }}>{props.children}</div>
    </Tag>
  );
};

export default React.memo(Scrub);
