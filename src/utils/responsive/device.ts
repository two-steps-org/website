export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export function getDeviceType(): DeviceType {
  // Enhanced device detection with more precise breakpoints
  // Use more precise breakpoints with safety margins
  const width = Math.max(320, Math.min(window.innerWidth, window.document.documentElement.clientWidth));
  
  // Mobile: 320px - 767px
  if (width < 768) return 'mobile';
  // Tablet: 768px - 1023px
  if (width < 1024) return 'tablet';
  // Desktop: 1024px and above
  return 'desktop'; 
}

export function isTouchDevice(): boolean {
  return (
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    ((navigator as unknown as { msMaxTouchPoints?: number }).msMaxTouchPoints ?? 0) > 0
  );
}

export const isMobileDevice = () => getDeviceType() === 'mobile';
export const isTabletDevice = () => getDeviceType() === 'tablet';
export const isDesktopDevice = () => getDeviceType() === 'desktop';