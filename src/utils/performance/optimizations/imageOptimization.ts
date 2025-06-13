export interface ImageDimensions {
  width: number;
  height: number;
}

// Get optimal image size based on container and device
export function getOptimalImageSize(
  containerWidth: number,
  devicePixelRatio: number = window.devicePixelRatio || 1
): number {
  return Math.ceil((containerWidth * devicePixelRatio) / 100) * 100;
}

// Generate responsive srcSet
export function generateSrcSet(url: string, sizes: number[]): string {
  return sizes
    .map(size => `${getImageUrl(url, size)} ${size}w`)
    .join(', ');
}

// Get optimized image URL with WebP format
export function getImageUrl(url: string, width: number): string {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}w=${width}&format=webp&q=80`;
}

// Calculate aspect ratio for preventing layout shift
export function calculateAspectRatio({ width, height }: ImageDimensions): number {
  return (height / width) * 100;
}

// Image loading priorities
export const imageLoadingPriority = {
  high: {
    loading: 'eager' as const,
    fetchpriority: 'high' as const,
    decoding: 'sync' as const
  },
  low: {
    loading: 'lazy' as const,
    fetchpriority: 'low' as const,
    decoding: 'async' as const
  }
};