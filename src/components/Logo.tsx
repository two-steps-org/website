import React from 'react';
import { cn } from '../lib/utils';

interface LogoProps {
  width?: string;
  height?: string;
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ width = '180px', height = '120px', className }) => {
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <img width={width} height={height} src="/logo4.png" alt="Logo" className="object-contain" />
    </div>
  );
};

export default Logo;
