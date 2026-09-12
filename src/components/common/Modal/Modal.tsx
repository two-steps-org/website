import React, { useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl' | '5xl';
  showCloseButton?: boolean;
  icon?: React.ReactNode;
}

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '4xl': 'max-w-4xl',
  '5xl': 'max-w-5xl',
};

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'lg',
  showCloseButton = true,
  icon,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const scrollPosition = useRef(0);

  // Lock scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      scrollPosition.current = window.scrollY;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosition.current}px`;
      document.body.style.width = '100%';
      document.body.style.paddingRight = `${scrollbarWidth}px`;

      return () => {
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.paddingRight = '';
        window.scrollTo({ top: scrollPosition.current, behavior: 'instant' });
      };
    }
  }, [isOpen]);

  // Close modal on Escape key press
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Auto-focus modal when opened
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center"
        >
          {/* Backdrop */}
          <m.button
            type="button"
            aria-label="Close modal backdrop"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-bg/70 backdrop-blur-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-ink"
          />

          {/* Modal Container */}
          <div className="pointer-events-none w-full h-full flex items-center justify-center p-4 mobile-safe-px mobile-safe-pb mobile-safe-pt">
            <m.div
              ref={modalRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? "modal-title" : undefined}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className={`
                pointer-events-auto relative w-full
                ${maxWidthClasses[maxWidth]} 
                max-h-[90dvh] flex flex-col
                bg-surface 
                rounded-card
                border border-line 
                backdrop-blur-xl 
                overflow-hidden
                will-change-transform
                touch-manipulation
              `}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="sticky top-0 z-20 flex items-center justify-between p-5 border-b border-line bg-inherit">
                  {title && (
                    <div className="flex items-center gap-4">
                      {icon && (
                        <div className="w-12 h-12 rounded-nested border border-line-strong bg-surface-2 flex items-center justify-center text-ink shrink-0">
                          {icon}
                        </div>
                      )}
                      <h3 id="modal-title" className="ts-h3 text-ink line-clamp-2">
                        {title}
                      </h3>
                    </div>
                  )}
                  
                  {showCloseButton && (
                    <m.button
                      onClick={onClose}
                      aria-label="Close modal"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center justify-center min-h-[44px] min-w-[44px] rounded-full border border-line-strong text-ink hover:bg-ink/10 transition-colors touch-manipulation shrink-0"
                    >
                      <X className="w-5 h-5 text-ink" />
                    </m.button>
                  )}
                </div>
              )}

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto overscroll-contain custom-scrollbar">
                {children}
              </div>
            </m.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;
