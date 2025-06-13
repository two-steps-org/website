import React from 'react';
import { motion } from 'framer-motion';
import { useBreakpoint } from '../../../utils/responsive/hooks';
import { TYPOGRAPHY } from '../../../utils/typography/constants';
import clsx from 'clsx';

interface HeadingProps {
  children: React.ReactNode;
  level: 1 | 2 | 3;
  gradient?: boolean;
  className?: string;
  animate?: boolean;
}

export const Heading: React.FC<HeadingProps> = ({
  children,
  level,
  gradient = false,
  className = '',
  animate = false,
}) => {
  const breakpoint = useBreakpoint();
  const isMobile = ['xs', 'sm', 'md'].includes(breakpoint);
  const typography = isMobile ? TYPOGRAPHY.mobile : TYPOGRAPHY.desktop;
  const variant = `h${level}` as 'h1' | 'h2' | 'h3';
  const styles = typography[variant];

  // Use the motion component for the specified heading level
  const Component = motion[`h${level}`];

  // Animation props when enabled
  const motionProps = animate
    ? {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.5 },
      }
    : {};

  return (
    <Component
      className={clsx(
        isMobile ? `mobile-heading-${level}` : styles.size,
        'leading-[1.2]',
        styles.tracking,
        'font-bold',
        gradient && 'bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent',
        isMobile && 'text-left px-4',
        className
      )}
      {...motionProps}
    >
      {children}
    </Component>
  );
};

export default Heading;
