import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

interface SynthflowWidgetProps {
  isVisible: boolean;
  onClose?: () => void;
  mode?: 'chat' | 'voice';
}

const SynthflowWidget: React.FC<SynthflowWidgetProps> = ({ isVisible, onClose, mode = 'chat' }) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Widget */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="relative w-[400px] h-[600px] max-h-[90vh]"
          >
            <div className="relative w-full h-full rounded-2xl overflow-hidden border border-gray-800/50 shadow-2xl">
              <iframe
                id="audio_iframe"
                src="https://widget.synthflow.ai/widget/v2/1732177854819x380410148233298400/1732177854720x160915902876459070"
                allow="microphone"
                className="w-full h-full"
                style={{ border: 'none', background: 'transparent' }}
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default React.memo(SynthflowWidget);
