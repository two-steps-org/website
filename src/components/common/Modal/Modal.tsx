import React, { useEffect, useRef, useCallback } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useBreakpoint } from '../../../utils/responsive/hooks';
import clsx from 'clsx';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showCloseButton?: boolean;
  gradient?: string;
  icon?: React.ReactNode;
  scrollbarStyle?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'lg',
  showCloseButton = true,
  gradient = 'from-blue-500 to-purple-500',
  icon,
  scrollbarStyle
}) => {
  const breakpoint = useBreakpoint();
  const isMobile = ['xs', 'sm'].includes(breakpoint);
  const isTablet = breakpoint === 'md';
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

  // Memoized click outside handler
  const handleClickOutside = useCallback(
    (e: React.MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    },
    [onClose]
  );

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={handleClickOutside}
        >
          {/* Backdrop */}
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <div className="w-full h-full flex items-center justify-center p-4 xs:p-5 sm:p-6">
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
                relative w-full 
                ${maxWidthClasses[maxWidth]} 
                max-h-[90vh] flex flex-col
                bg-gradient-to-b from-gray-900/95 to-black/95 
                rounded-2xl
                border border-gray-800/50 
                backdrop-blur-xl 
                overflow-hidden
                will-change-transform
                touch-manipulation
              `}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="sticky top-0 z-20 flex items-center justify-between p-5 border-b border-gray-800/50 bg-inherit">
                  {title && (
                    <div className="flex items-center gap-4">
                      {icon && (
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${gradient} p-[1px]`}>
                          <div className="w-full h-full rounded-xl bg-gray-900 flex items-center justify-center">
                            {icon}
                          </div>
                        </div>
                      )}
                      <h3 id="modal-title" className={`text-2xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent line-clamp-1`}>
                        {title}
                      </h3>
                    </div>
                  )}
                  
                  {showCloseButton && (
                    <m.button
                      onClick={onClose}
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-2 rounded-lg bg-gradient-to-r ${gradient} hover:opacity-90 transition-opacity touch-manipulation`}
                    >
                      <X className="w-5 h-5 text-white" />
                    </m.button>
                  )}
                </div>
              )}

              {/* Modal Content */}
              <div className={clsx(
                'flex-1 overflow-y-auto overscroll-contain -webkit-overflow-scrolling-touch',
                scrollbarStyle ? scrollbarStyle : 'custom-scrollbar'
              )}>
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
