import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useAnimationOptimizer } from '../../utils/performance/hooks/useAnimationOptimizer';
import { useBreakpoint } from '../../utils/responsive/hooks/useBreakpoint';
import clsx from 'clsx';

interface AnimatedBackgroundProps {
  className?: string;
  children?: React.ReactNode;
  intensity?: 'high' | 'medium' | 'low';
}

const AnimatedBackground: React.FC<AnimatedBackgroundProps> = ({
  className = '',
  children,
  intensity = 'medium'
}) => {
  const animationQuality = useAnimationOptimizer();
  const prefersReducedMotion = useReducedMotion();
  const { deviceCategory } = useBreakpoint();
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const isVisible = useRef<boolean>(false);
  
  // Determine effective intensity
  let effectiveIntensity: 'high' | 'medium' | 'low' = intensity;
  if (prefersReducedMotion || animationQuality === 'low') {
    effectiveIntensity = 'low';
  } else if (deviceCategory === 'mobile' && intensity === 'high') {
    effectiveIntensity = 'medium';
  }
  
  // Memoize animation duration based on effectiveIntensity
  const animationDuration = useMemo(() => {
    if (effectiveIntensity === 'low') return 20;
    if (effectiveIntensity === 'medium') return 15;
    return 10;
  }, [effectiveIntensity]);

  // Use IntersectionObserver to control animation when not visible
  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible.current = entry.isIntersecting;
        setShouldAnimate(entry.isIntersecting);
      },
      { threshold: 0.1 }
    );
    
    observer.observe(containerRef.current);
    
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);
  
  return (
    <div ref={containerRef} className={clsx('relative overflow-hidden', className)}>
      {/* Animated Gradient Background */}
      {shouldAnimate && !prefersReducedMotion ? (
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-blue-500/5"
          animate={{
            background: [
              'linear-gradient(to bottom right, rgba(59,130,246,0.05), rgba(168,85,247,0.05), rgba(59,130,246,0.05))',
              'linear-gradient(to bottom right, rgba(168,85,247,0.05), rgba(59,130,246,0.05), rgba(168,85,247,0.05))',
              'linear-gradient(to bottom right, rgba(59,130,246,0.05), rgba(168,85,247,0.05), rgba(59,130,246,0.05))'
            ]
          }}
          transition={{
            duration: animationDuration,
            repeat: Infinity,
            ease: 'linear',
            repeatType: 'reverse'
          }}
          style={{
            willChange: 'background'
          }}
        />
      ) : (
        // Static gradient for reduced motion or when animation is off
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-blue-500/5" />
      )}

      {/* Static grid pattern for added texture */}
      <div 
        className="absolute inset-0 bg-grid-pattern opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0z' fill='%23FFFFFF' fill-opacity='0.05'/%3E%3C/svg%3E")`,
          backgroundSize: '20px 20px'
        }} 
      />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default React.memo(AnimatedBackground);
