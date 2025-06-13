import React, { memo } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface SectionDividerProps {
  /** Additional class names to style the divider */
  className?: string;
  /** Tailwind gradient classes (default: "from-transparent via-blue-500/20 to-transparent") */
  gradient?: string;
}

/**
 * A horizontal divider with optional gradient glows above and below.
 * The main line is animated in with a fade/scale transition.
 */
const SectionDivider: React.FC<SectionDividerProps> = ({
  className = '',
  gradient = 'from-transparent via-blue-500/20 to-transparent'
}) => {
  return (
    <div className={clsx('relative w-full h-px', className)}>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="absolute inset-0"
      >
        {/* Top Glow */}
        <div className="absolute inset-x-0 -top-4 h-4 bg-gradient-to-b from-blue-500/5 to-transparent" />
        
        {/* Main Gradient Line */}
        <div className={clsx('absolute inset-x-0 top-0 h-px bg-gradient-to-r', gradient)} />

        {/* Bottom Glow */}
        <div className="absolute inset-x-0 -bottom-4 h-4 bg-gradient-to-t from-blue-500/5 to-transparent" />
      </motion.div>
    </div>
  );
};

export default memo(SectionDivider);
