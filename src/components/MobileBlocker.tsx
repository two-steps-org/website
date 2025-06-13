import React from 'react';
import { Monitor } from 'lucide-react';

const MobileBlocker: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-black flex items-center justify-center p-4 z-[100]">
      <div className="text-center space-y-4">
        <Monitor className="w-12 h-12 text-blue-500 mx-auto" />
        <h1 className="text-xl font-bold text-white">Large Screen Only</h1>
        <p className="text-gray-400 max-w-xs mx-auto">
          This website requires a screen width of at least 1024px. Please visit us on a larger screen.
        </p>
        <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent mt-8" />
      </div>
    </div>
  );
};

export default MobileBlocker;