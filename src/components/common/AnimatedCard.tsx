import React, { useState, useRef, useCallback, useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Player } from '@lottiefiles/react-lottie-player';
import { useIntersectionObserver } from '../../utils/performance/hooks/useIntersectionObserver';
import { useAnimationOptimizer } from '../../utils/performance/hooks/useAnimationOptimizer';
import clsx from 'clsx';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
  animationData?: any;
  onClick?: () => void;
  animationDelay?: number;
}

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = '',
  gradient = 'from-blue-500 to-purple-500',
  animationData,
  onClick,
  animationDelay = 0,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [setRef, isVisible] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '100px 0px',
  });
  const animationQuality = useAnimationOptimizer();
  const prefersReducedMotion = useReducedMotion();
  const [animationLoaded, setAnimationLoaded] = useState(false);

  // Disable animations for low performance or reduced motion
  const isAnimationDisabled = animationQuality === 'low' || prefersReducedMotion;

  // Combine refs using a callback ref pattern
  const setRefs = useCallback((element: HTMLDivElement) => {
    setRef(element);
    cardRef.current = element;
  }, [setRef]);

  // Memoize card variants to avoid unnecessary recalculations
  const cardVariants = useMemo(
    () => ({
      initial: { scale: 1 },
      hover: { scale: isAnimationDisabled ? 1 : 1.02 },
    }),
    [isAnimationDisabled]
  );

  // Handle animation load state
  const handleAnimationLoad = useCallback(() => {
    setAnimationLoaded(true);
  }, []);

  // Determine if the animation should render
  const shouldRenderAnimation = isVisible && isHovered && animationData && !isAnimationDisabled;

  // Mouse enter/leave handlers
  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  return (
    <motion.div
      ref={setRefs}
      variants={cardVariants}
      initial="initial"
      whileHover="hover"
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 20,
        delay: animationDelay 
      }}
      className={clsx('relative group', className)}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative overflow-hidden rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 hover:border-blue-500/30 transition-all duration-300">
        {children}

        {shouldRenderAnimation && (
          <div 
            className={clsx(
              'absolute inset-0 transition-opacity duration-300',
              animationLoaded ? 'opacity-10' : 'opacity-0'
            )}
            style={{ willChange: 'opacity' }}
          >
            <Player
              autoplay
              loop
              src={animationData}
              className="w-full h-full"
              style={{ position: 'absolute', top: 0, left: 0 }}
              onEvent={event => {
                if (event === 'load') handleAnimationLoad();
              }}
              rendererSettings={{
                progressiveLoad: true,
                hideOnTransparent: true,
              }}
            />
          </div>
        )}
      </div>

      {!isAnimationDisabled && (
        <div 
          className={clsx(
            'absolute -inset-2 bg-gradient-to-r',
            gradient,
            'rounded-3xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 -z-10'
          )}
          style={{ willChange: 'opacity' }}
        />
      )}
    </motion.div>
  );
};

export default React.memo(AnimatedCard);
