export { breakpoints, type Breakpoint } from './breakpoints';
export { useBreakpoint, useViewportSize, useScrollLock } from './hooks';

export const isDesktop = (width: number) => width >= 1024;
export const getBreakpoint = (width: number): Breakpoint => {
  if (width >= 1536) return '2xl';
  if (width >= 1280) return 'xl';
  return 'lg';
};