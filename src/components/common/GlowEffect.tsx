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
  opacity = 0.5,
  blur = '100px',
  className = '',
}) => {
  const presets: Record<string, { background: string; glow: string }> = {
    blue: {
      background:
        'radial-gradient(circle at center, rgba(59,130,246,0.65) 0%, rgba(59,130,246,0.18) 38%, transparent 70%)',
      glow: '0 0 200px rgba(59,130,246,0.35), 0 0 380px rgba(59,130,246,0.25)',
    },
    purple: {
      background:
        'radial-gradient(circle at center, rgba(168,85,247,0.6) 0%, rgba(168,85,247,0.18) 38%, transparent 70%)',
      glow: '0 0 200px rgba(168,85,247,0.35), 0 0 380px rgba(168,85,247,0.22)',
    },
    cyan: {
      background:
        'radial-gradient(circle at center, rgba(6,182,212,0.6) 0%, rgba(6,182,212,0.2) 38%, transparent 70%)',
      glow: '0 0 200px rgba(6,182,212,0.35), 0 0 360px rgba(6,182,212,0.25)',
    },
    navy: {
      background:
        'radial-gradient(circle at center, rgba(24,61,129,0.65) 0%, rgba(19,47,99,0.2) 40%, transparent 72%)',
      glow: '0 0 200px rgba(20,40,77,0.4), 0 0 380px rgba(31,76,149,0.28)',
    },
  };

  const palette = presets[color] ?? presets.blue;

  return (
    <motion.div
      className={clsx('absolute pointer-events-none select-none mix-blend-screen', className)}
      initial={{ opacity: opacity * 0.35, scale: 0.95 }}
      animate={{
        opacity: [opacity * 0.6, opacity, opacity * 0.6],
        scale: [1.05, 1.22, 1.05],
      }}
      transition={{
        duration: 5.2,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      style={{
        background: palette.background,
        filter: `blur(${blur})`,
        boxShadow: palette.glow,
        willChange: 'transform, opacity',
      }}
    />
  );
};

export default React.memo(GlowEffect);
