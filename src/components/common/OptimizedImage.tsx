import React, { memo } from 'react';
import clsx from 'clsx';
import { useImagePreload } from '../../utils/performance/hooks';
import {
  getOptimalImageSize,
  generateSrcSet,
  imageLoadingPriority
} from '../../utils/performance/optimizations/imageOptimization';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** The image source (path or URL) */
  src: string;
  /** Alt text for the image */
  alt: string;
  /** The sizes attribute for responsive images (default: "100vw") */
  sizes?: string;
  /** Priority for loading (maps to loading attributes) */
  priority?: 'high' | 'low';
  /** Additional class names */
  className?: string;
}

/**
 * OptimizedImage utilizes dynamic srcsets and preloading to provide
 * a responsive, performance-friendly image component.
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  sizes = '100vw',
  priority = 'low',
  className = '',
  ...props
}) => {
  // Determine if the image is loaded using the custom hook
  const isLoaded = useImagePreload(src);

  // Get container width (or assume 1920 for SSR environments)
  const containerWidth = typeof window !== 'undefined' ? window.innerWidth : 1920;

  // Derive the optimal size for current container width
  const optimalSize = getOptimalImageSize(containerWidth);

  // Filter image sizes up to twice the optimal size
  const imageSizes = [320, 640, 768, 1024, 1280, 1536, 1920].filter(
    size => size <= optimalSize * 2
  );

  // Generate the srcSet string for responsive images
  const srcSet = generateSrcSet(src, imageSizes);

  return (
    <img
      src={src}
      alt={alt}
      sizes={sizes}
      srcSet={srcSet}
      className={clsx(
        className,
        'transition-opacity duration-300',
        isLoaded ? 'opacity-100' : 'opacity-0'
      )}
      // Spread loading attributes from an object (e.g., { loading: "lazy" } or { loading: "eager" })
      {...imageLoadingPriority[priority]}
      {...props}
    />
  );
};

export default memo(OptimizedImage);
