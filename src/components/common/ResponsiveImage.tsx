import React from 'react';
import { cn } from '../../lib/utils';

interface ResponsiveImageProps extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'width' | 'height'> {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
  width?: number;
  height?: number;
}

/**
 * ResponsiveImage Component
 * 
 * Optimized for performance and preventing Layout Shift (CLS).
 * Adds explicit width/height attributes to prevent layout shifts.
 */
const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt,
  className,
  containerClassName,
  aspectRatio = 'auto',
  objectFit = 'cover',
  loading = 'lazy',
  decoding = 'async',
  width,
  height,
  ...props
}) => {
  // Map aspect ratio to tailwind classes and default dimensions
  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-portrait',
    auto: '',
  };

  // Default dimensions based on aspect ratio to prevent CLS
  const defaultDimensions = {
    square: { width: 800, height: 800 },
    video: { width: 1280, height: 720 },
    portrait: { width: 720, height: 1280 },
    auto: { width: 800, height: 600 },
  };

  const imgWidth = width ?? defaultDimensions[aspectRatio].width;
  const imgHeight = height ?? defaultDimensions[aspectRatio].height;

  return (
    <div className={cn(
      'relative overflow-hidden w-full h-full', 
      aspectClasses[aspectRatio], 
      containerClassName
    )}>
      <img
        src={src}
        alt={alt}
        loading={loading}
        decoding={decoding}
        width={imgWidth}
        height={imgHeight}
        className={cn(
          'w-full h-full',
          objectFit === 'cover' && 'object-cover',
          objectFit === 'contain' && 'object-contain',
          className
        )}
        {...props}
      />
    </div>
  );
};

export default ResponsiveImage;
