import React from 'react';
import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';
import { useBreakpoint } from '../../utils/responsive/hooks';
import clsx from 'clsx';

interface CardProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  className?: string;
  gradient?: string;
  onClick?: () => void;
  interactive?: boolean;
}

const Card: React.FC<CardProps> = ({
  icon: Icon,
  title,
  description,
  className = '',
  gradient = 'from-blue-500 to-purple-500',
  onClick,
  interactive = true,
}) => {
  const breakpoint = useBreakpoint();
  const isMobile = ['xs', 'sm'].includes(breakpoint);

  return (
    <motion.div
      whileHover={interactive ? { y: -4, scale: 1.02 } : undefined}
      whileTap={interactive ? { scale: 0.99 } : undefined}
      onClick={onClick}
      className={clsx(
        'relative group overflow-hidden bg-gray-900/50 backdrop-blur-xl',
        'border border-gray-800/50 hover:border-blue-500/50',
        'rounded-lg xs:rounded-xl sm:rounded-2xl',
        'p-4 xs:p-5 sm:p-6 w-full',
        'max-w-[calc(100vw-2rem)] xs:max-w-[calc(100vw-3rem)] sm:max-w-[calc(100vw-4rem)] md:max-w-none',
        'transition-all duration-300 touch-action-manipulation',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {Icon && (
        <div
          className={clsx(
            'w-10 xs:w-11 sm:w-12',
            'h-10 xs:h-11 sm:h-12',
            'rounded-lg xs:rounded-xl sm:rounded-2xl',
            `bg-gradient-to-r ${gradient}`,
            'p-[1px]',
            'mb-4 xs:mb-5 sm:mb-6',
            'group-hover:scale-110 transition-transform duration-300'
          )}
        >
          <div className="w-full h-full rounded-xl bg-gray-900 flex items-center justify-center">
            <Icon
              className={clsx(
                'w-5 xs:w-5.5 sm:w-6',
                'h-5 xs:h-5.5 sm:h-6',
                'text-white'
              )}
            />
          </div>
        </div>
      )}

      <h3
        className={clsx(
          'text-lg xs:text-xl sm:text-2xl font-bold mb-2 xs:mb-3 sm:mb-4',
          `bg-gradient-to-r ${gradient} bg-clip-text text-transparent`,
          'line-clamp-2 xs:line-clamp-none',
          'tracking-tight'
        )}
      >
        {title}
      </h3>

      <p
        className={clsx(
          'text-sm xs:text-base sm:text-lg text-gray-400 leading-relaxed',
          'line-clamp-3 xs:line-clamp-2 sm:line-clamp-none',
          'tracking-normal'
        )}
      >
        {description}
      </p>

      {/* Hover Glow Effect */}
      <div
        className={clsx(
          'absolute -inset-2 bg-gradient-to-r',
          gradient,
          'rounded-3xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 -z-10'
        )}
      />
    </motion.div>
  );
};

export default React.memo(Card);
