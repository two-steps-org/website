import React from 'react';
import clsx from 'clsx';

interface CardContainerProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const CardContainer: React.FC<CardContainerProps> = ({ children, className, style }) => {
  return (
    <div
      className={clsx(
        'group relative h-full overflow-hidden',
        'bg-surface/85 border border-line/50',
        'transition-[background-color,border-color,transform,box-shadow]',
        'hover:bg-surface hover:border-line-strong',
        'hover:-translate-y-0.5',
        'hover:shadow-[0_28px_60px_-18px_rgba(0,0,0,0.65),0_0_0_1px_rgba(255,255,255,0.05)]',
        'cursor-default touch-manipulation',
        className,
      )}
      style={{
        ...style,
        borderRadius: '20px',
        transitionDuration: '220ms',
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      <div
        className="absolute left-0 right-0 top-0 z-[5] h-px"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.12), transparent)',
        }}
        aria-hidden="true"
      />
      <div className="relative z-[2] flex h-full flex-col p-6 lg:p-8">{children}</div>
    </div>
  );
};

export default React.memo(CardContainer);
