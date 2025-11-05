import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface GlowEffectProps {
  /** Color key for the glow effect (e.g., "blue", "purple", "cyan") */
  color?: string;
  /** Base opacity value for the glow effect */
  opacity?: number;
  /** Blur amount for the glow effect */
  blur?: string;
  /** Additional custom classes */
  className?: string;
}

/**
 * GlowEffect renders an animated, blurred glow using Framer Motion.
 */
const GlowEffect: React.FC<GlowEffectProps> = ({
  color = 'blue',
  opacity = 0.1,
  blur = '100px',
  className = '',
}) => {
  const colors: Record<string, string> = {
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    cyan: 'bg-cyan-500',
  };

  return (
    <motion.div
      className={clsx('absolute rounded-full', colors[color], className)}
      initial={{ opacity: 0 }}
      animate={{
        opacity: [opacity * 0.5, opacity, opacity * 0.5],
        scale: [0.9, 1.1, 0.9],
      }}
      transition={{
        duration: 4,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{
        filter: `blur(${blur})`,
        willChange: 'transform, opacity',
      }}
    />
  );
};

export default React.memo(GlowEffect);
