import React from 'react';

interface LogoProps {
  width?: string;
  height?: string;
}

const Logo: React.FC<LogoProps> = ({ width = "180px", height = "120px" }) => {
  return (
    <div className="flex items-center space-x-2">
      <img 
        width={width}
        height={height}
        src="/logo4.png" 
        alt="Logo" 
        className="object-contain"
      />
    </div>
  );
};

export default Logo;