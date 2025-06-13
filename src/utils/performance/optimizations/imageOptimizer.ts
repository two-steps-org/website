// Enhanced image optimization utilities
export interface ImageOptimizationConfig {
  quality?: number;
  format?: 'webp' | 'avif';
  width?: number;
  height?: number;
  priority?: 'high' | 'low';
  sizes?: string;
}

const defaultSizes = {
  mobile: '100vw',
  tablet: '50vw',
  desktop: '33vw'
};

export function getOptimizedImageUrl(
  url: string,
  config: ImageOptimizationConfig = {}
): string {
  const {
    quality = 80,
    format = 'webp',
    width,
    height
  } = config;

  // Add optimization parameters to URL
  const params = new URLSearchParams();
  params.append('q', quality.toString());
  params.append('fm', format);
  if (width) params.append('w', width.toString());
  if (height) params.append('h', height.toString());
  
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${params.toString()}`;
}

export function generateImageAttributes(
  src: string,
  config: ImageOptimizationConfig = {}
): {
  src: string;
  srcSet: string;
  sizes: string;
  loading: 'lazy' | 'eager';
  decoding: 'async' | 'sync';
  fetchPriority: 'high' | 'low';
} {
  const {
    priority = 'low',
    sizes = defaultSizes.mobile
  } = config;

  const widths = [320, 640, 768, 1024, 1280, 1536, 1920];
  const srcSet = generateResponsiveSrcSet(src, widths);

  return {
    src: getOptimizedImageUrl(src, config),
    srcSet,
    sizes,
    loading: priority === 'high' ? 'eager' : 'lazy',
    decoding: priority === 'high' ? 'sync' : 'async',
    fetchPriority: priority
  };
}
export function generateResponsiveSrcSet(
  url: string,
  widths: number[],
  format: 'webp' | 'avif' = 'webp'
): string {
  return widths
    .map(width => {
      const optimizedUrl = getOptimizedImageUrl(url, { width, format });
      return `${optimizedUrl} ${width}w`;
    })
    .join(', ');
}