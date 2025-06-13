import type { Breakpoint } from '../../utils/responsive/breakpoints';

/**
 * Represents the width and height of a logo in pixels.
 */
export interface LogoSize {
  width: number;
  height: number;
}

/**
 * Returns the appropriate logo size for a given breakpoint.
 * @param breakpoint - The current responsive breakpoint.
 */
export function getLogoSize(breakpoint: Breakpoint): LogoSize {
  switch (breakpoint) {
    case 'xs':
      return { width: 100, height: 40 };
    case 'sm':
      return { width: 120, height: 48 };
    case 'md':
      return { width: 140, height: 56 };
    case 'lg':
    case 'xl':
    case '2xl':
      return { width: 180, height: 72 };
    default:
      return { width: 140, height: 56 };
  }
}
