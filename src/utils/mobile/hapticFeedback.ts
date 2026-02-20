/**
 * Haptic feedback utilities for mobile interactions
 * Provides tactile feedback on iOS and Android devices
 */

export const hapticFeedback = {
  /**
   * Light haptic feedback for subtle interactions
   * Use for: button taps, selection changes
   */
  light: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(10);
    }
  },

  /**
   * Medium haptic feedback for standard interactions
   * Use for: card expansion, tab switches
   */
  medium: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(20);
    }
  },

  /**
   * Heavy haptic feedback for important actions
   * Use for: form submissions, confirmations
   */
  heavy: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(30);
    }
  },

  /**
   * Success haptic pattern
   * Use for: successful operations, completions
   */
  success: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([10, 50, 10]);
    }
  },

  /**
   * Error haptic pattern
   * Use for: validation errors, failed operations
   */
  error: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([30, 50, 30]);
    }
  },

  /**
   * Selection haptic feedback
   * Use for: selecting items, focus changes
   */
  selection: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(5);
    }
  },

  /**
   * Warning haptic pattern
   * Use for: destructive actions, warnings
   */
  warning: () => {
    if ('vibrate' in navigator) {
      navigator.vibrate([20, 30, 20]);
    }
  },
};

/**
 * Check if haptic feedback is supported
 */
export const isHapticSupported = (): boolean => {
  return 'vibrate' in navigator;
};