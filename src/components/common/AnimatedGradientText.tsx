import React, { useEffect, useState } from 'react';
import { isMobileDevice } from '../../utils/responsive/device';
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
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    setIsMobile(isMobileDevice());
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);
    
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const shouldDisableAnimation = disabled || isMobile || prefersReducedMotion;

  // Use CSS animation on desktop, static on mobile
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
    <span
      className={clsx(
        'bg-gradient-to-r',
        'bg-clip-text',
        'text-transparent',
        'bg-[length:200%_auto]',
        'animate-gradient-shift',
        gradient,
        className
      )}
      style={{
        animationDuration: `${duration}s`,
      }}
    >
      {children}
    </span>
  );
};

export default React.memo(AnimatedGradientText);

