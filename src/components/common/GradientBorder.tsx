import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface GradientBorderProps {
  /** Content wrapped inside the gradient border */
  children: React.ReactNode;
  /** Additional custom classes */
  className?: string;
  /** Tailwind gradient classes (e.g. "from-blue-500 to-purple-500") */
  gradient?: string;
  /** Thickness of the gradient border, applied as margin around the inner content */
  borderWidth?: string;
  /** Whether the border is animated */
  isAnimated?: boolean;
}

/**
 * A container with a gradient border using Tailwind gradients.
 * The inner content is placed within a card-like box.
 */
const GradientBorder: React.FC<GradientBorderProps> = ({
  children,
  className = '',
  gradient = 'from-blue-500 to-purple-500',
  borderWidth = '1px',
  isAnimated = true
}) => {
  return (
    <div className={clsx('relative', className)}>
      <motion.div
        className={clsx('absolute inset-0 rounded-xl bg-gradient-to-r', gradient)}
        {...(isAnimated
          ? {
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
      />
      <div
        className="relative rounded-xl bg-gray-900"
        style={{ margin: borderWidth }}
      >
        {children}
      </div>
    </div>
  );
};

export default React.memo(GradientBorder);
