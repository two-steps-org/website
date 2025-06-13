import React from 'react';
import { Player } from '@lottiefiles/react-lottie-player';
import { waveAnimation } from '../../animations';

interface AnimatedWaveProps {
  /**
   * Additional classes to customize the outer container.
   */
  className?: string;
  /**
   * The color of the wave. When set to 'purple', applies a hue-rotate filter.
   * Defaults to 'blue'.
   */
  color?: string;
}

const AnimatedWave: React.FC<AnimatedWaveProps> = ({
  className = '',
  color = 'blue'
}) => {
  // Determine the hue-rotate based on the provided color.
  const hueRotate = color === 'purple' ? '60deg' : '0deg';

  return (
    <div className={`absolute w-full overflow-hidden ${className}`}>
      <Player
        autoplay
        loop
        src={waveAnimation}
        className="w-full"
        style={{
          filter: `hue-rotate(${hueRotate})`
        }}
      />
    </div>
  );
};

export default React.memo(AnimatedWave);
