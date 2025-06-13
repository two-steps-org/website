import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface GradientTextProps {
  /** The text content to be rendered inside the gradient text span */
  children: React.ReactNode;
  /** Additional classes for styling */
  className?: string;
  /** Whether to animate the gradient background or not */
  animate?: boolean;
  /** The starting color for the gradient */
  from?: string;
  /** An optional middle “via” color for the gradient */
  via?: string;
  /** The ending color for the gradient */
  to?: string;
}

/**
 * GradientText applies a gradient background to text, optionally animating it.
 */
const GradientText: React.FC<GradientTextProps> = ({
  children,
  className = '',
  animate = true,
  from = 'blue-400',
  via = 'purple-400',
  to = 'blue-400'
}) => {
  // Build gradient classes using Tailwind color utilities
  const gradientClasses = clsx(
    'bg-gradient-to-r',
    `from-${from}`,
    via && `via-${via}`,
    `to-${to}`
  );

  return (
    <motion.span
      // Initial and animate props only apply if animate is true
      {...(animate
        ? {
            initial: { backgroundPosition: '0% 50%' },
            animate: {
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
            },
            transition: {
              duration: 8,
              repeat: Infinity,
              ease: 'linear'
            },
            style: { willChange: 'background-position' }
          }
        : {})}
      className={clsx(
        gradientClasses,
        'bg-clip-text text-transparent bg-[length:200%_auto]',
        className
      )}
    >
      {children}
    </motion.span>
  );
};

export default React.memo(GradientText);
