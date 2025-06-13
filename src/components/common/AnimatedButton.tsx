import React from 'react';
import { motion } from 'framer-motion';
import { Player } from '@lottiefiles/react-lottie-player';
import { LucideIcon } from 'lucide-react';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  icon?: LucideIcon;
  gradient?: string;
  animationData?: any;
  disabled?: boolean;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onClick,
  className = '',
  icon: Icon,
  gradient = 'from-blue-500 to-purple-500',
  animationData,
  disabled = false
}) => {
  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled}
      // Adding the 'group' class to enable group-hover styles on inner elements
      className={`group relative overflow-hidden rounded-xl font-medium transition-all duration-300 ${className}`}
    >
      {/* Button Content */}
      <div className="relative z-10 flex items-center justify-center gap-2">
        {Icon && <Icon className="w-5 h-5" />}
        {children}
      </div>

      {/* Lottie Animation Overlay */}
      {animationData && (
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Player
            autoplay
            loop
            src={animationData}
            className="w-full h-full"
            style={{ position: 'absolute', top: 0, left: 0 }}
          />
        </div>
      )}

      {/* Gradient Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-90 group-hover:opacity-100 transition-opacity duration-300`}
      />
    </motion.button>
  );
};

export default React.memo(AnimatedButton);
