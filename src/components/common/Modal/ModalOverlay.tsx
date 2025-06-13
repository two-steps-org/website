import React from 'react';
import { motion } from 'framer-motion';

interface ModalOverlayProps {
  /** Opacity level for the overlay background (default: 0.8) */
  opacity?: number;
}

/**
 * ModalOverlay component provides a backdrop with a fade-in/out animation.
 */
const ModalOverlay: React.FC<ModalOverlayProps> = ({ opacity = 0.8 }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm will-change-opacity"
      style={{ '--tw-bg-opacity': opacity } as React.CSSProperties}
    />
  );
};

export default React.memo(ModalOverlay);
