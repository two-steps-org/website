import React from 'react';
import { m } from 'framer-motion';
import { useBreakpoint } from '../../../utils/responsive/hooks';
import { TYPOGRAPHY } from '../../../utils/typography/constants';
import clsx from 'clsx';

interface TextProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  type?: 'textHeavy' | 'interactive';
  gradient?: boolean;
  className?: string;
  animate?: boolean;
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  type = 'textHeavy',
  gradient = false,
  className = '',
  animate = false,
}) => {
  const breakpoint = useBreakpoint();
  const isMobile = ['xs', 'sm', 'md'].includes(breakpoint);
  const typography = isMobile ? TYPOGRAPHY.mobile : TYPOGRAPHY.desktop;

  const getTypographyClasses = () => {
    if (variant === 'body') {
      const styles = typography.body;
      return clsx(styles[type], styles.lineHeight, styles.tracking, isMobile && 'text-left');
    }
    const styles = typography[variant] as { size: string; tracking: string };
    return clsx(styles.size, 'leading-[1.5]', styles.tracking, isMobile && 'text-left');
  };

  const Component = (m as unknown as Record<string, React.ElementType>)[variant === 'body' ? 'p' : variant];

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
        getTypographyClasses(),
        gradient && 'bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent',
        className
      )}
      {...motionProps}
    >
      {children}
    </Component>
  );
};

export default Text;
