import React, { memo } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import ParticleBackground from '../ParticleBackground';

interface SectionBackgroundProps {
  /** The content to be displayed on top of the background */
  children: React.ReactNode;
  /** Tailwind gradient classes for the orbs (e.g. "from-blue-500/10 via-purple-500/10 to-blue-500/10") */
  gradient?: string;
  /** Additional custom classes for the container */
  className?: string;
}

/**
 * SectionBackground adds gradient orbs, a grid pattern, and a subtle vignette
 * behind its children, creating a visually appealing section.
 */
const SectionBackground: React.FC<SectionBackgroundProps> = ({
  children,
  gradient = 'from-blue-500/10 via-purple-500/10 to-blue-500/10',
  className = ''
}) => {
  return (
    <section className={clsx('relative overflow-hidden', className)}>
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Primary Gradient Orb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0.3, 0.5, 0.3],
            scale: [0.9, 1.1, 0.9]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className={clsx(
            'absolute top-1/4 left-1/2 -translate-x-1/2 w-[200vw] aspect-square',
            'rounded-full blur-[100px]',
            'bg-gradient-to-br',
            gradient
          )}
        />

        {/* Secondary Gradient Orb */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1.1, 0.9, 1.1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: 4
          }}
          className={clsx(
            'absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[200vw] aspect-square',
            'rounded-full blur-[100px]',
            'bg-gradient-to-br',
            gradient
          )}
        />

        {/* Grid Pattern & Particles */}
        <div className="absolute inset-0">
          <ParticleBackground />
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] bg-[length:24px_24px]" />
        </div>

        {/* Subtle Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20" />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10">
        {children}
      </div>
    </section>
  );
};

export default memo(SectionBackground);
