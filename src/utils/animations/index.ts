import { TIMING, EASINGS } from './constants';

export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: TIMING.default / 1000 }
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: TIMING.default / 1000 }
  }
};

export const transitions = {
  spring: {
    type: 'spring',
    stiffness: 200,
    damping: 20
  },
  smooth: {
    type: 'tween',
    ease: EASINGS.default,
    duration: TIMING.default / 1000
  }
};