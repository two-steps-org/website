import React, { useEffect, useRef, useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { X, RotateCcw } from 'lucide-react';
import clsx from 'clsx';

interface WidgetContainerProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'chat' | 'voice';
}

const widgetConfigMap = {
  chat: {
    src: 'https://app.stammer.ai/en/chatbot/embed/d0debb06-5e1c-4c26-a996-f7f1e54a6752?theme=dark&embedded=true',
    gradient: 'from-purple-500 via-pink-500 to-purple-500',
    title: 'AI Chat Assistant',
  },
  voice: {
    src: 'https://widget.synthflow.ai/widget/v2/1732177854819x380410148233298400/1732177854720x160915902876459070',
    gradient: 'from-amber-500 via-orange-500 to-amber-500',
    title: 'AI Voice Assistant',
  },
};

let lastRestart = 0;

const WidgetContainer: React.FC<WidgetContainerProps> = ({ isOpen, onClose, mode }) => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const modalRoot =
    (typeof document !== 'undefined' && document.getElementById('modal-root')) || undefined;
  const config = widgetConfigMap[mode];
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleRestart = useCallback(() => {
    const now = Date.now();
    if (now - lastRestart < 1000) return; // throttle quick restarts
    lastRestart = now;
    if (iframeRef.current) {
      // safer reload without losing referrer policy: replace with current src
      const src = iframeRef.current.src;
      iframeRef.current.src = 'about:blank';
      // small delay to allow teardown
      setTimeout(() => {
        if (iframeRef.current) iframeRef.current.src = src;
      }, 50);
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', onKey);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  // render portal only in client
  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label={config.title}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.18 }}
            className="relative w-full max-w-3xl mx-4 h-[85vh] max-h-[900px]"
          >
            <div
              className={clsx(
                'relative h-full rounded-2xl overflow-hidden p-[1px] bg-gradient-to-r',
                config.gradient,
              )}
            >
              <div className="absolute inset-0 bg-gray-900/98 backdrop-blur-sm rounded-2xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-4 h-12 border-b border-gray-800">
                  <div className="text-sm font-medium text-white">{config.title}</div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleRestart}
                      aria-label="Restart widget"
                      className="w-8 h-8 rounded-md bg-gray-800/60 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                    >
                      <RotateCcw className="w-4 h-4 text-gray-300" />
                    </button>
                    <button
                      onClick={onClose}
                      aria-label="Close widget"
                      className="w-8 h-8 rounded-md bg-gray-800/60 flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                    >
                      <X className="w-4 h-4 text-gray-300" />
                    </button>
                  </div>
                </div>

                {/* iframe */}
                <div className="flex-1 min-h-0">
                  <iframe
                    ref={iframeRef}
                    src={config.src}
                    title={config.title}
                    allow="microphone; autoplay; camera"
                    loading="lazy"
                    sandbox="allow-scripts allow-forms allow-same-origin allow-modals"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="w-full h-full border-0 bg-transparent"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return modalRoot
    ? createPortal(modalContent, modalRoot)
    : createPortal(modalContent, document.body);
};

export default React.memo(WidgetContainer);
