import { useDeviceType } from '../responsive/hooks/useDeviceType';

export type AnimationLevel = 'none' | 'minimal' | 'reduced' | 'full';

/**
 * Performance-first animation configuration based on device type
 * and user preferences
 */
export function useOptimizedAnimation() {
  const deviceType = useDeviceType();

  // Check for reduced motion preference
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    return {
      level: 'none' as AnimationLevel,
      transition: { duration: 0 },
      spring: { type: 'spring', stiffness: 0, damping: 0 },
      opacity: { duration: 0 },
      scale: { duration: 0 },
      layout: { duration: 0 },
    };
  }

  // Animation levels based on device type
  switch (deviceType) {
    case 'mobile':
      // Mobile: Minimal animations for performance
      return {
        level: 'minimal' as AnimationLevel,
        transition: { duration: 0.2 },
        spring: { type: 'spring', stiffness: 200, damping: 25 },
        opacity: { duration: 0.15 },
        scale: { duration: 0.15 },
        layout: { duration: 0.2 },
      };

    case 'tablet':
      // Tablet: Reduced animations
      return {
        level: 'reduced' as AnimationLevel,
        transition: { duration: 0.3 },
        spring: { type: 'spring', stiffness: 250, damping: 28 },
        opacity: { duration: 0.2 },
        scale: { duration: 0.2 },
        layout: { duration: 0.3 },
      };

    case 'desktop':
    default:
      // Desktop: Full animations
      return {
        level: 'full' as AnimationLevel,
        transition: { duration: 0.4 },
        spring: { type: 'spring', stiffness: 300, damping: 30 },
        opacity: { duration: 0.3 },
        scale: { duration: 0.3 },
        layout: { duration: 0.4 },
      };
  }
}

/**
 * Framer Motion variants optimized for performance
 */
export const optimizedVariants = {
  // Fade in variants
  fadeIn: {
    hidden: { opacity: 0 },
    visible: (config: { level: AnimationLevel }) => ({
      opacity: 1,
      transition: {
        duration: config.level === 'none' ? 0 : config.level === 'minimal' ? 0.15 : 0.3,
      },
    }),
  },

  // Slide in variants
  slideIn: {
    hidden: { x: 100, opacity: 0 },
    visible: (config: { level: AnimationLevel }) => ({
      x: 0,
      opacity: 1,
      transition: {
        duration: config.level === 'none' ? 0 : config.level === 'minimal' ? 0.2 : 0.4,
      },
    }),
  },

  // Scale in variants
  scaleIn: {
    hidden: { scale: 0.9, opacity: 0 },
    visible: (config: { level: AnimationLevel }) => ({
      scale: 1,
      opacity: 1,
      transition: {
        duration: config.level === 'none' ? 0 : config.level === 'minimal' ? 0.15 : 0.3,
      },
    }),
  },

  // Stagger children for lists/grids
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: (config: { level: AnimationLevel }) => ({
      opacity: 1,
      transition: {
        staggerChildren: config.level === 'none' ? 0 : config.level === 'minimal' ? 0.05 : 0.1,
        delayChildren: config.level === 'none' ? 0 : 0.1,
      },
    }),
  },

  // Item animation for staggered children
  staggerItem: {
    hidden: { y: 20, opacity: 0 },
    visible: (config: { level: AnimationLevel }) => ({
      y: 0,
      opacity: 1,
      transition: {
        duration: config.level === 'none' ? 0 : config.level === 'minimal' ? 0.2 : 0.4,
      },
    }),
  },
};

/**
 * Helper to determine if marquee animations should be enabled
 */
export function useMarqueeAnimation(): boolean {
  const deviceType = useDeviceType();
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Disable marquee on mobile and if user prefers reduced motion
  if (prefersReducedMotion) return false;
  if (deviceType === 'mobile') return false;

  return true;
}

/**
 * Helper to get carousel swipe sensitivity based on device
 */
export function useCarouselSwipe() {
  const deviceType = useDeviceType();

  return {
    swipePower: (offset: number, velocity: number) => Math.abs(offset) * velocity,
    swipeThreshold: deviceType === 'mobile' ? 5000 : 10000,
    dragConstraints: { left: 0, right: 0 },
    dragElastic: deviceType === 'mobile' ? 0.5 : 1,
  };
}