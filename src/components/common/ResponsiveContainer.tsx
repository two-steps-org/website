import React, { memo } from 'react';
import clsx from 'clsx';
import { useBreakpoint } from '../../utils/responsive/hooks';

interface ResponsiveContainerProps {
  /** Child elements to be displayed inside the container. */
  children: React.ReactNode;
  /** Additional class names for styling. */
  className?: string;
  /** The HTML tag or React element to render as (default: 'div'). */
  as?: keyof JSX.IntrinsicElements;
  /** Maximum width breakpoint (sm, md, lg, xl, 2xl, or full). */
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}

/** Maps the maxWidth prop to Tailwind CSS max-width classes. */
const maxWidthClasses = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  full: 'max-w-full',
};

/**
 * A responsive container that automatically applies horizontal padding,
 * sets max-width, and centers content based on breakpoints.
 */
const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = '',
  as: Component = 'div',
  maxWidth = '2xl',
}) => {
  const breakpoint = useBreakpoint();

  return (
    <Component
      className={clsx(
        'w-full mx-auto overflow-hidden px-4 sm:px-6 lg:px-8',
        maxWidthClasses[maxWidth],
        className
      )}
      data-breakpoint={breakpoint}
    >
      {children}
    </Component>
  );
};

export default memo(ResponsiveContainer);
