import { LucideIcon } from 'lucide-react';

const iconCache = new Map<string, LucideIcon>();

export function optimizeIcon(icon: LucideIcon): LucideIcon {
  const iconName = icon.displayName || icon.name;
  
  if (!iconName) return icon;
  
  if (!iconCache.has(iconName)) {
    iconCache.set(iconName, icon);
  }
  
  return iconCache.get(iconName) || icon;
}

export function preloadIcons(icons: LucideIcon[]): void {
  icons.forEach(icon => {
    const iconName = icon.displayName || icon.name;
    if (iconName && !iconCache.has(iconName)) {
      iconCache.set(iconName, icon);
    }
  });
}