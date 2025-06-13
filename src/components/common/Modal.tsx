import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useBreakpoint } from '../../utils/responsive/hooks';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  showCloseButton?: boolean;
  gradient?: string;
  icon?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'lg',
  showCloseButton = true,
  gradient = 'from-blue-500 to-purple-500',
  icon
}) => {
  const breakpoint = useBreakpoint();
  const isMobile = ['xs', 'sm'].includes(breakpoint);
  const isTablet = breakpoint === 'md';
  const modalRef = useRef<HTMLDivElement>(null);
  const scrollPosition = useRef(0);

  // Lock scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      // Store current scroll position and scrollbar width
      scrollPosition.current = window.scrollY;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      
      // Lock body scroll
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollPosition.current}px`;
      document.body.style.width = '100%';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
      
      return () => {
        // Restore body scroll
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.width = '';
        document.body.style.paddingRight = '';
        window.scrollTo(0, scrollPosition.current);
      };
    }
  }, [isOpen]);

  // Handle click outside
  const handleClickOutside = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

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
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Container */}
          <div className="w-full h-full flex items-center justify-center p-4 xs:p-5 sm:p-6">
            {/* Modal Content */}
            <motion.div
              ref={modalRef}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.3 }}
              className={`
                relative w-full 
                ${isMobile || isTablet ? 'h-[calc(100%-2rem)]' : maxWidthClasses[maxWidth]} 
                bg-gradient-to-b from-gray-900/95 to-black/95 
                rounded-xl xs:rounded-2xl
                border border-gray-800/50 
                backdrop-blur-xl 
                overflow-hidden
                will-change-transform
                touch-manipulation
              `}
            >
              {/* Header */}
              {(title || showCloseButton) && (
                <div className="sticky top-0 z-20 flex items-center justify-between p-4 xs:p-5 sm:p-6 border-b border-gray-800/50 bg-inherit">
                  {title && (
                    <div className="flex items-center gap-3 xs:gap-4">
                      {icon && (
                        <div className={`w-8 xs:w-10 sm:w-12 h-8 xs:h-10 sm:h-12 rounded-lg xs:rounded-xl bg-gradient-to-r ${gradient} p-[1px]`}>
                          <div className="w-full h-full rounded-lg xs:rounded-xl bg-gray-900 flex items-center justify-center">
                            {icon}
                          </div>
                        </div>
                      )}
                      <h3 className={`text-base xs:text-lg sm:text-xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent line-clamp-1`}>
                        {title}
                      </h3>
                    </div>
                  )}
                  
                  {showCloseButton && (
                    <motion.button
                      onClick={onClose}
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.9 }}
                      className={`p-2 xs:p-2.5 rounded-lg bg-gradient-to-r ${gradient} hover:opacity-90 transition-opacity touch-manipulation`}
                    >
                      <X className="w-4 xs:w-5 h-4 xs:h-5 text-white" />
                    </motion.button>
                  )}
                </div>
              )}

              {/* Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar overscroll-contain -webkit-overflow-scrolling-touch">
                <div className="p-4 xs:p-5 sm:p-6">
                  {children}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Modal;