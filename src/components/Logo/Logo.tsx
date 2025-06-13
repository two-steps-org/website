import React from 'react';
import { useBreakpoint } from '../../utils/responsive/hooks';
import { Brain } from 'lucide-react';
import clsx from 'clsx';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  const breakpoint = useBreakpoint();
  const isMobile = ['xs', 'sm'].includes(breakpoint);

  return (
    <div className={clsx('flex items-center gap-2', className)}>
      <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 p-[1px] shrink-0">
        <div className="w-full h-full rounded-lg bg-black flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" aria-hidden="true" />
        </div>
      </div>
      <span
        className={clsx(
          'font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent whitespace-nowrap',
          isMobile ? 'text-lg' : 'text-xl'
        )}
      >
        Two Steps
      </span>
    </div>
  );
};

export default React.memo(Logo);
