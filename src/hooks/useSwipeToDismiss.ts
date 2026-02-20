import React, { useState, useRef, useCallback, useEffect } from 'react';

interface UseSwipeToDismissOptions {
  threshold?: number;
  onDismiss: () => void;
  disabled?: boolean;
  direction?: 'vertical' | 'horizontal';
}

/**
 * Hook for implementing swipe-to-dismiss gesture
 * Supports both vertical and horizontal swipe gestures
 */
export function useSwipeToDismiss(options: UseSwipeToDismissOptions) {
  const {
    threshold = 100,
    onDismiss,
    disabled = false,
    direction = 'vertical',
  } = options;

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDismissing, setIsDismissing] = useState(false);

  const startPosRef = useRef({ x: 0, y: 0 });
  const elementRef = useRef<HTMLElement>(null);

  const handleStart = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (disabled) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      startPosRef.current = { x: clientX, y: clientY };
      setIsDragging(true);
      setDragOffset(0);
      setIsDismissing(false);
    },
    [disabled]
  );

  const handleMove = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      if (disabled || !isDragging) return;

      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;

      const offsetX = clientX - startPosRef.current.x;
      const offsetY = clientY - startPosRef.current.y;

      // Calculate offset based on direction
      const offset = direction === 'vertical' ? offsetY : offsetX;
      setDragOffset(offset);

      // Check if past threshold for dismiss animation
      if (Math.abs(offset) > threshold) {
        setIsDismissing(true);
      } else {
        setIsDismissing(false);
      }
    },
    [disabled, isDragging, threshold, direction]
  );

  const handleEnd = useCallback(() => {
    if (disabled || !isDragging) return;

    if (Math.abs(dragOffset) > threshold) {
      // Trigger dismiss
      onDismiss();
    } else {
      // Reset position
      setDragOffset(0);
      setIsDismissing(false);
    }

    setIsDragging(false);
  }, [disabled, isDragging, dragOffset, threshold, onDismiss]);

  // Add event listeners
  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    element.addEventListener('touchstart', handleStart, { passive: true });
    element.addEventListener('touchmove', handleMove, { passive: true });
    element.addEventListener('touchend', handleEnd, { passive: true });
    element.addEventListener('mousedown', handleStart);
    element.addEventListener('mousemove', handleMove);
    element.addEventListener('mouseup', handleEnd);

    return () => {
      element.removeEventListener('touchstart', handleStart);
      element.removeEventListener('touchmove', handleMove);
      element.removeEventListener('touchend', handleEnd);
      element.removeEventListener('mousedown', handleStart);
      element.removeEventListener('mousemove', handleMove);
      element.removeEventListener('mouseup', handleEnd);
    };
  }, [handleStart, handleMove, handleEnd]);

  return {
    elementRef,
    isDragging,
    dragOffset,
    isDismissing,
  };
}