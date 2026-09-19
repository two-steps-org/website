/** Full motion in the local design preview; production follows the device.
 * Add ?motion=system locally to check the accessible reduced-motion version.
 */
export const PREVIEW_FULL_MOTION = import.meta.env.DEV &&
  (typeof window === 'undefined' || new URLSearchParams(window.location.search).get('motion') !== 'system');

export const prefersReducedMotion = () =>
  !PREVIEW_FULL_MOTION &&
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;
