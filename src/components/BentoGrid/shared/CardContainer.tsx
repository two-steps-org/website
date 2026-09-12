import React from 'react';
import { m } from 'framer-motion';
import clsx from 'clsx';
import { scaleItem } from '../../../utils/motion';

interface CardContainerProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
  onMouseMove?: (e: React.MouseEvent<HTMLDivElement>) => void;
  style?: React.CSSProperties;
  /** Position in the bento grid, used to stagger the reveal. */
  index?: number;
}

const CardContainer: React.FC<CardContainerProps> = ({
  children,
  className,
  onMouseMove,
  style,
  index = 0,
}) => {
  return (
    <m.div
      className={clsx(
        'group relative overflow-hidden',
        'bg-surface/50 backdrop-blur-xl',
        'border border-line/50',
        'transition-all',
        'hover:bg-surface/80 hover:border-line-strong',
        'hover:-translate-y-0.5',
        'hover:shadow-[0_28px_60px_-18px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,255,255,0.05)]',
        'cursor-default touch-manipulation',
        'h-full',
        className
      )}
      onMouseMove={onMouseMove}
      style={{
        ...style,
        borderRadius: '20px',
        transitionDuration: '600ms',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      } as React.CSSProperties}
      {...scaleItem(index)}
    >
      {/* Top border gradient */}
      <div
        className="absolute top-0 left-0 right-0 h-px z-[5]"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
        }}
        aria-hidden="true"
      />

      {/* Content wrapper with padding */}
      <div className="relative z-[2] p-6 lg:p-8 flex flex-col h-full">{children}</div>
    </m.div>
  );
};

export default React.memo(CardContainer);
