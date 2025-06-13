import { useCallback, useRef } from 'react';

/**
 * Handlers for swipe events.
 */
interface SwipeHandlers {
  onSwipedLeft?: () => void;
  onSwipedRight?: () => void;
  onSwiping?: () => void;
  onSwiped?: () => void;
}

/**
 * Handlers for touch events.
 */
interface SwipeableHandlers {
  onTouchStart: (e: React.TouchEvent) => void;
  onTouchMove: (e: React.TouchEvent) => void;
  onTouchEnd: () => void;
}

/**
 * Custom hook for handling swipe gestures on touch devices.
 * It determines swipe direction based on the touch start and end coordinates,
 * and triggers appropriate callbacks.
 */
export function useSwipeable({
  onSwipedLeft,
  onSwipedRight,
  onSwiping,
  onSwiped,
}: SwipeHandlers): SwipeableHandlers {
  // Store the starting and ending touch coordinates
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const touchEnd = useRef<{ x: number; y: number } | null>(null);

  // Minimum distance (in pixels) for a gesture to be considered a swipe
  const minSwipeDistance = 50;

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchEnd.current = null;
    touchStart.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY,
    };
  }, []);

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      touchEnd.current = {
        x: e.targetTouches[0].clientX,
        y: e.targetTouches[0].clientY,
      };
      onSwiping?.();
    },
    [onSwiping]
  );

  const onTouchEnd = useCallback(() => {
    if (!touchStart.current || !touchEnd.current) return;

    const distanceX = touchStart.current.x - touchEnd.current.x;
    const distanceY = touchStart.current.y - touchEnd.current.y;
    const isHorizontalSwipe = Math.abs(distanceX) > Math.abs(distanceY);

    if (isHorizontalSwipe && Math.abs(distanceX) > minSwipeDistance) {
      // Determine swipe direction
      if (distanceX > 0) {
        onSwipedLeft?.();
      } else {
        onSwipedRight?.();
      }
    }

    onSwiped?.();
    // Reset touch positions
    touchStart.current = null;
    touchEnd.current = null;
  }, [onSwipedLeft, onSwipedRight, onSwiped]);

  return { onTouchStart, onTouchMove, onTouchEnd };
}
