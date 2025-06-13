import React, { memo } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import SectionDivider from './SectionDivider';

interface SectionContainerProps {
  /** Section content */
  children: React.ReactNode;
  /** Additional classes for styling */
  className?: string;
  /** Optional ID for the section (used in anchor navigation) */
  id?: string;
  /** Whether to render a section divider at the bottom */
  withDivider?: boolean;
  /** Tailwind gradient classes (if the divider is gradient-based) */
  gradient?: string;
  /** Whether to remove default vertical padding */
  noPadding?: boolean;
}

/**
 * A flexible section container with animated orbs, grid pattern, 
 * and an optional bottom divider.
 */
const BaseSectionContainer: React.FC<SectionContainerProps> = ({
  children,
  className = '',
  id,
  withDivider = true,
  gradient,
  noPadding = false
}) => {
  return (
    <section
      id={id}
      className={clsx(
        'relative overflow-hidden w-full',
        !noPadding && 'py-16 sm:py-24 lg:py-32',
        className
      )}
    >
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-full sm:w-[800px] h-[800px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-full sm:w-[800px] h-[800px] bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-full blur-[120px] animate-pulse" />

        {/* Enhanced Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />

        {/* Subtle Vignette Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20" />
      </div>

      {/* Content Container */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="responsive-container relative z-10"
      >
        {children}
      </motion.div>

      {/* Section Divider */}
      {withDivider && (
        <div className="absolute bottom-0 left-0 w-full">
          <SectionDivider gradient={gradient} />
        </div>
      )}
    </section>
  );
};

BaseSectionContainer.displayName = 'SectionContainer';

export default memo(BaseSectionContainer);
