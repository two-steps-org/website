import React, { memo } from 'react';
import clsx from 'clsx';
import { useBreakpoint } from '../../utils/responsive';

/**
 * Maps a base image path to a sized image URL.
 * This assumes you have a utility function that appends width parameters or performs resizing.
 * Replace with your actual implementation (e.g., Cloudinary or similar).
 */
function getImageUrl(baseUrl: string, width: number): string {
  // Example function: adjust for your environment
  return `${baseUrl}?w=${width}`;
}

interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** The image path or URL for mobile screens (optional) */
  mobileSrc?: string;
  /** The image path or URL for tablet screens (optional) */
  tabletSrc?: string;
  /** The image path or URL for desktop screens (required) */
  desktopSrc: string;
  /** The alt text for the image */
  alt: string;
  /** Additional class names */
  className?: string;
  /** Sizes attribute for responsive images */
  sizes?: string;
}

/**
 * ResponsiveImage automatically picks an appropriate image variant
 * based on the user's screen width, using srcSet & sizes.
 */
const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  mobileSrc,
  tabletSrc,
  desktopSrc,
  alt,
  className = '',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  ...props
}) => {
  const breakpoint = useBreakpoint();

  // Build a srcSet array with optional mobile/tablet images and the default desktop image
  const srcSet = [
    mobileSrc && `${getImageUrl(mobileSrc, 640)} 640w`,
    tabletSrc && `${getImageUrl(tabletSrc, 1024)} 1024w`,
    `${getImageUrl(desktopSrc, 1536)} 1536w`
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <img
      src={desktopSrc}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      className={clsx('w-full h-auto max-w-full object-cover', className)}
      loading="lazy"
      decoding="async"
      data-breakpoint={breakpoint}
      {...props}
    />
  );
};

export default memo(ResponsiveImage);
