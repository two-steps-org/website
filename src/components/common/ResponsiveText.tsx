import React from 'react';
import { useBreakpoint } from '../../utils/responsive';
import clsx from 'clsx';

interface ResponsiveTextProps {
  children: React.ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
  variant?: 'body' | 'heading' | 'display' | 'caption';
}

const variantClasses: Record<string, string> = {
  body: 'text-base sm:text-lg lg:text-xl',
  heading: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold',
  display: 'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold',
  caption: 'text-sm sm:text-base lg:text-lg',
};

const ResponsiveText: React.FC<ResponsiveTextProps> = ({
  children,
  className = '',
  as: Component = 'div',
  variant = 'body',
}) => {
  const breakpoint = useBreakpoint();

  return (
    <Component
      className={clsx(variantClasses[variant], className)}
      data-breakpoint={breakpoint}
    >
      {children}
    </Component>
  );
};

export default React.memo(ResponsiveText);
