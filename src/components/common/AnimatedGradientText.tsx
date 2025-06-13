import React, { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useAnimationOptimizer } from '../../utils/performance/hooks/useAnimationOptimizer';
import clsx from 'clsx';

interface AnimatedGradientTextProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
  duration?: number;
  disabled?: boolean;
}

const AnimatedGradientText: React.FC<AnimatedGradientTextProps> = ({
  children,
  className = '',
  gradient = 'from-blue-400 via-purple-400 to-blue-400',
  duration = 4,
  disabled = false,
}) => {
  const prefersReducedMotion = useReducedMotion();
  const animationQuality = useAnimationOptimizer();
  
  // Determine if animations should be disabled
  const shouldDisableAnimation = useMemo(() => {
    return disabled || prefersReducedMotion || animationQuality === 'low';
  }, [disabled, prefersReducedMotion, animationQuality]);
  
  // Adjust animation duration based on performance quality
  const adjustedDuration = useMemo(() => {
    return animationQuality === 'medium' ? duration * 1.5 : duration;
  }, [duration, animationQuality]);
  
  // If animations are disabled, render static gradient text
  if (shouldDisableAnimation) {
    return (
      <span
        className={clsx(
          'bg-gradient-to-r',
          'bg-clip-text',
          'text-transparent',
          gradient,
          className
        )}
      >
        {children}
      </span>
    );
  }
  
  return (
    <motion.span
      className={clsx(
        'bg-gradient-to-r',
        'bg-clip-text',
        'text-transparent',
        'bg-[length:200%_auto]',
        gradient,
        className
      )}
      animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
      transition={{
        duration: adjustedDuration,
        repeat: Infinity,
        ease: 'linear',
        willChange: 'background-position'
      }}
    >
      {children}
    </motion.span>
  );
};

export default React.memo(AnimatedGradientText);
