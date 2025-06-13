import React, { useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { X, MessageSquareText, Mic, RotateCcw } from 'lucide-react';
import clsx from 'clsx';

interface WidgetContainerProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'chat' | 'voice';
}

// Static widget configuration to avoid recreating on every render
const widgetConfigMap = {
  chat: {
    src: "https://app.stammer.ai/en/chatbot/embed/d0debb06-5e1c-4c26-a996-f7f1e54a6752",
    gradient: 'from-purple-500 via-pink-500 to-purple-500',
    title: 'AI Chat Assistant',
    icon: MessageSquareText,
  },
  voice: {
    src: "https://widget.synthflow.ai/widget/v2/1732177854819x380410148233298400/1732177854720x160915902876459070",
    gradient: 'from-amber-500 via-orange-500 to-amber-500',
    title: 'AI Voice Assistant',
    icon: Mic,
  },
};

const WidgetContainer: React.FC<WidgetContainerProps> = ({ isOpen, onClose, mode }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const modalRoot = document.getElementById('modal-root') || document.body;
  const config = widgetConfigMap[mode];
  const Icon = config.icon;

  // Memoize the restart handler
  const handleRestart = useCallback(() => {
    if (iframeRef.current) {
      if (mode === 'chat') {
        // Restart by resetting src
        iframeRef.current.src = iframeRef.current.src;
      } else {
        try {
          const contentWindow = iframeRef.current.contentWindow;
          if (contentWindow) {
            contentWindow.postMessage({ action: 'restart' }, '*');
          }
        } catch (error) {
          console.error('Failed to restart voice widget:', error);
        }
      }
    }
  }, [mode]);

  // Lock scroll and create modal-root if missing
  useEffect(() => {
    if (isOpen) {
      if (!document.getElementById('modal-root')) {
        const div = document.createElement('div');
        div.id = 'modal-root';
        document.body.appendChild(div);
      }
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = '15px';
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    };
  }, [isOpen]);

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 flex items-center justify-center"
          style={{ 
            zIndex: 999999, // Extremely high z-index to ensure it's always on top
            isolation: 'isolate' // Creates a new stacking context
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
            style={{ zIndex: 1 }}
          />

          {/* Widget Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, type: "spring", damping: 20 }}
            className="relative w-[400px] h-[600px] max-h-[80vh] mx-4"
            style={{ 
              zIndex: 2,
              marginTop: '2rem',
              marginBottom: '2rem'
            }}
          >
            {/* Container Box */}
            <div className={clsx(
              'relative h-full rounded-2xl overflow-hidden shadow-2xl',
              'bg-gradient-to-r p-[1px]',
              config.gradient
            )}>
              <div className="w-full h-full bg-gradient-to-b from-gray-900/95 to-black/95 backdrop-blur-xl rounded-2xl overflow-hidden flex flex-col">
                {/* Custom Header */}
                <div className="absolute top-0 left-0 right-0 z-50 h-14 bg-gradient-to-b from-gray-900 to-gray-900/95 border-b border-gray-800/50 px-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={clsx(
                      'w-8 h-8 rounded-lg bg-gradient-to-r p-[1px] group',
                      config.gradient
                    )}>
                      <div className="w-full h-full rounded-lg bg-gray-900 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                    </div>
                    <h3 className={clsx(
                      'text-base font-medium bg-gradient-to-r bg-clip-text text-transparent',
                      config.gradient
                    )}>
                      {config.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={handleRestart}
                      className="w-7 h-7 rounded-lg bg-gray-800/50 flex items-center justify-center hover:bg-blue-500/20 transition-colors"
                      aria-label="Restart conversation"
                    >
                      <RotateCcw className="w-4 h-4 text-gray-400" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={onClose}
                      className="w-7 h-7 rounded-lg bg-gray-800/50 flex items-center justify-center hover:bg-red-500/20 transition-colors"
                      aria-label="Close widget"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </motion.button>
                  </div>
                </div>

                {/* Widget Content */}
                <div className="flex-grow relative">
                  <iframe 
                    ref={iframeRef}
                    src={config.src}
                    allow="microphone"
                    className="absolute inset-0 w-full h-full border-none bg-transparent"
                    style={{ 
                      marginTop: mode === 'chat' ? '0' : '56px',
                      height: mode === 'chat' ? 'calc(100% + 56px)' : 'calc(100% - 56px)'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Glow Effect */}
            <div 
              className={clsx(
                'absolute -inset-1 bg-gradient-to-r rounded-[1.2rem] blur-xl opacity-20 -z-10',
                config.gradient
              )}
              aria-hidden="true"
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, modalRoot);
};

export default WidgetContainer;
