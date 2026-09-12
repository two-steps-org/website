export const hapticFeedback = {
  light: () => navigator.vibrate?.(10),
  success: () => navigator.vibrate?.([10, 50, 10]),
  selection: () => navigator.vibrate?.(5),
};
