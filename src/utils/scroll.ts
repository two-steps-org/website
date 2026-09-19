import { createContext, useEffect, useState, type RefObject } from 'react';
import { useScroll, type MotionValue } from 'framer-motion';
import { PREVIEW_FULL_MOTION } from './motionPreference';

// Share section progress with headline words so nested animations stay in phase.
export const ScrollProgressContext = createContext<MotionValue<number> | null>(null);
type Offset = NonNullable<Parameters<typeof useScroll>[0]>['offset'];

/** 0 → 1 as the element travels from entering at the bottom to leaving at the top. */
export function useSectionProgress(
  target: RefObject<HTMLElement | null>,
  offset: Offset = ['start end', 'end start'],
): MotionValue<number> {
  // Measured in a layout effect (Framer's default) so a block already in the
  // viewport paints at its scrolled position instead of one frame at p=0
  // followed by a snap. Every target here is a descendant of the caller, so
  // the ref is attached by the time the effect runs.
  return useScroll({ target, offset }).scrollYProgress;
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

/** Share the same preview policy as MotionConfig and CSS animations. */
export const useReducedMotionQuery = () => {
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)');
  return !PREVIEW_FULL_MOTION && reduced;
};
