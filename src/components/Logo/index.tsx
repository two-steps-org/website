import React, { memo } from 'react';
import { Brain } from 'lucide-react';
import clsx from 'clsx';

interface LogoProps {
  /** Optional additional class names */
  className?: string;
}

/**
 * The Two Steps AI logo, featuring a Brain icon with a gradient background.
 */
const Logo: React.FC<LogoProps> = ({ className = '' }) => {
  return (
    <div className={clsx('flex items-center', className)}>
      <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 p-[1px] shrink-0">
        <div className="w-full h-full rounded-lg bg-black flex items-center justify-center">
          <Brain className="w-5 h-5 text-white" aria-hidden="true" />
        </div>
      </div>
      <span className="ml-2 font-bold text-xl bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent whitespace-nowrap">
        Two Steps
      </span>
    </div>
  );
};

export default memo(Logo);
