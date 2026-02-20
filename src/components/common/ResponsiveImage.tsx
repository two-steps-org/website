import React from 'react';
import { cn } from '../../lib/utils';

interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  aspectRatio?: 'square' | 'video' | 'portrait' | 'auto';
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down';
}

/**
 * ResponsiveImage Component
 * 
 * Optimized for performance and preventing Layout Shift (CLS).
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
  ...props
}) => {
  // Map aspect ratio to tailwind classes
  const aspectClasses = {
    square: 'aspect-square',
    video: 'aspect-video',
    portrait: 'aspect-portrait',
    auto: '',
  };

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
