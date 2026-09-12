export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export function getDeviceType(): DeviceType {
  const width = Math.max(320, Math.min(window.innerWidth, window.document.documentElement.clientWidth));

  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
}
