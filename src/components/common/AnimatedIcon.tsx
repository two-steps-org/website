import React from 'react';
import { motion } from 'framer-motion';
import { Player } from '@lottiefiles/react-lottie-player';
import { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface AnimatedIconProps {
  icon: LucideIcon;
  animationData?: any;
  className?: string;
  gradient?: string;
}

/**
 * AnimatedIcon component renders an icon with a gradient background.
 * It can optionally display a Lottie animation if animationData is provided.
 */
const AnimatedIcon: React.FC<AnimatedIconProps> = ({
  icon: Icon,
  animationData,
  className = '',
  gradient = 'from-blue-500 to-purple-500'
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.1 }}
      className={clsx(
        'relative w-12 h-12 rounded-xl bg-gradient-to-r p-[1px]',
        gradient,
        className
      )}
    >
      <div className="w-full h-full rounded-xl bg-gray-900 flex items-center justify-center overflow-hidden">
        {animationData ? (
          <Player
            autoplay
            loop
            src={animationData}
            className="w-8 h-8"
          />
        ) : (
          <Icon className="w-6 h-6 text-white" />
        )}
      </div>
    </motion.div>
  );
};

export default React.memo(AnimatedIcon);
