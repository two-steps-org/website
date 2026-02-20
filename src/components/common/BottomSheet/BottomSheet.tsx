import React, { ReactNode, useRef, useCallback, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useDeviceType } from '../../../utils/responsive/hooks/useDeviceType';
import { useSwipeToDismiss } from '../../../hooks/useSwipeToDismiss';
import { hapticFeedback } from '../../../utils/mobile/hapticFeedback';
import BottomSheetOverlay from './BottomSheetOverlay';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  snapPoints?: number[];
  initialSnap?: number;
  title?: string;
  showCloseButton?: boolean;
}

export default function BottomSheet({
  isOpen,
  onClose,
  children,
  title,
  showCloseButton = true,
}: BottomSheetProps) {
  const deviceType = useDeviceType();
  const isMobile = deviceType === 'mobile';
  const sheetRef = useRef<HTMLDivElement>(null);

  const handleClose = useCallback(() => {
    hapticFeedback.light();
    onClose();
  }, [onClose]);

  const { elementRef, isDismissing } = useSwipeToDismiss({
    onDismiss: handleClose,
    threshold: 100,
    disabled: !isMobile,
    direction: 'vertical',
  });

  // Combine refs
  useEffect(() => {
    if (elementRef.current) {
      sheetRef.current = elementRef.current;
    }
  }, [elementRef]);

  const handleBackdropClick = useCallback(() => {
    hapticFeedback.light();
    onClose();
  }, [onClose]);

  if (!isMobile) {
    // On desktop/tablet, don't render bottom sheet (use regular modal instead)
    return null;
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <BottomSheetOverlay onClick={handleBackdropClick}>
          <m.div
            ref={elementRef}
            initial={{ y: '100%' }}
            animate={{ y: isDismissing ? '100%' : 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30,
              mass: 0.8,
            }}
            className="fixed bottom-0 left-0 right-0 max-h-[90dvh] rounded-t-3xl bg-gray-900/95 backdrop-blur-xl border border-gray-800/50 shadow-2xl z-50"
            style={{
              paddingBottom: `max(1rem, env(safe-area-inset-bottom))`,
            }}
          >
            {/* Handle Indicator */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-12 h-1.5 bg-gray-600 rounded-full" />
            </div>

            {/* Header */}
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800/50">
                {title && (
                  <h3 className="text-lg font-semibold text-white">
                    {title}
                  </h3>
                )}
                {showCloseButton && (
                  <button
                    onClick={handleClose}
                    className="p-2 rounded-lg bg-gray-800/50 hover:bg-gray-700/50 transition-colors min-h-[44px] min-w-[44px]"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div className="overflow-y-auto max-h-[calc(90dvh-120px)] custom-scrollbar">
              <div className="p-4 pt-2">
                {children}
              </div>
            </div>
          </m.div>
        </BottomSheetOverlay>
      )}
    </AnimatePresence>
  );
}