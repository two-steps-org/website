export interface ImageDimensions {
  width: number;
  height: number;
}

export const imageLoadingPriority = {
  high: {
    loading: 'eager' as const,
    fetchpriority: 'high' as const
  },
  low: {
    loading: 'lazy' as const,
    fetchpriority: 'low' as const
  }
};

export function getOptimalImageSize(
  containerWidth: number,
  devicePixelRatio: number = window.devicePixelRatio
): number {
  // Round up to nearest multiple of 100 for CDN breakpoints
  return Math.ceil((containerWidth * devicePixelRatio) / 100) * 100;
}

export function generateSrcSet(url: string, sizes: number[]): string {
  return sizes
    .map(size => `${getImageUrl(url, size)} ${size}w`)
    .join(', ');
}

export function getImageUrl(url: string, width: number): string {
  // Add width parameter for CDN optimization
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}w=${width}`;
}

export function generateSrcSet(url: string, sizes: number[]): string {
  return sizes
    .map(size => `${getImageUrl(url, size)} ${size}w`)
    .join(', ');
}

export function getImageUrl(url: string, width: number): string {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}w=${width}&format=webp&q=80`;
}

export function calculateAspectRatio({ width, height }: ImageDimensions): number {
  return (height / width) * 100;
}

export const imageLoadingPriority = {
  high: {
    loading: 'eager' as const,
    fetchpriority: 'high' as const
  },
  low: {
    loading: 'lazy' as const,
    fetchpriority: 'low' as const
  }
};