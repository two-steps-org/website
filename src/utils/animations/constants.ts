export const TIMING = {
  fast: 150,
  default: 200,
  slow: 300,
  extraSlow: 500
} as const;

export const EASINGS = {
  // Smooth easing for natural motion
  default: 'cubic-bezier(0.4, 0, 0.2, 1)',
  // Energetic easing for emphasis
  emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
  // Gentle deceleration
  decelerate: 'cubic-bezier(0, 0, 0.2, 1)',
  // Quick acceleration
  accelerate: 'cubic-bezier(0.4, 0, 1, 1)'
} as const;

export const TRANSITIONS = {
  transform: `transform ${TIMING.default}ms ${EASINGS.default}`,
  opacity: `opacity ${TIMING.default}ms ${EASINGS.default}`,
  background: `background ${TIMING.default}ms ${EASINGS.default}`,
  color: `color ${TIMING.default}ms ${EASINGS.default}`,
  border: `border ${TIMING.default}ms ${EASINGS.default}`,
  shadow: `box-shadow ${TIMING.default}ms ${EASINGS.default}`,
  all: `all ${TIMING.default}ms ${EASINGS.default}`
} as const;