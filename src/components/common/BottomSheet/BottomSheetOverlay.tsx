import React from 'react';
import { m } from 'framer-motion';

interface BottomSheetOverlayProps {
  children: React.ReactNode;
  onClick: () => void;
}

export default function BottomSheetOverlay({ children, onClick }: BottomSheetOverlayProps) {
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
      aria-hidden="true"
    >
      {children}
    </m.div>
  );
}