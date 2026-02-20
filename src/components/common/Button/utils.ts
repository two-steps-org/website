import { BUTTON_VARIANTS, BUTTON_SIZES, BUTTON_LAYOUT, BUTTON_STATES } from './constants';
import type { ButtonVariant, ButtonSize } from './types';

// Define an interface for the getButtonClasses parameters for improved clarity.
interface GetButtonClassesParams {
  variant: ButtonVariant;
  size: ButtonSize;
  fullWidth: boolean;
  responsive: boolean;
  loading: boolean;
  disabled: boolean;
}

/**
 * Returns a string of classes for a button based on the given parameters.
 *
 * @param {GetButtonClassesParams} params - The parameters for button styling.
 * @returns {string} - The final className string.
 */
export const getButtonClasses = ({
  variant,
  size,
  fullWidth,
  responsive,
  loading,
  disabled,
}: GetButtonClassesParams): string => {
  // Retrieve variant-specific classes and size-specific classes.
  const variantClasses = BUTTON_VARIANTS[variant];
  const sizeClasses = BUTTON_SIZES[size];

  // Construct an array of class strings.
  const classes = [
    // Base layout styles.
    BUTTON_LAYOUT.base,

    // Variant styles.
    variantClasses.base,
    variantClasses.hover,
    variantClasses.active,
    variantClasses.focus,
    variantClasses.disabled,

    // Size styles.
    sizeClasses.height,
    sizeClasses.padding,
    sizeClasses.fontSize,

    // Layout adjustments.
    fullWidth ? BUTTON_LAYOUT.fullWidth : '',
    responsive ? BUTTON_LAYOUT.responsive : '',

    // State-based classes.
    loading ? BUTTON_STATES.loading.base : '',
    disabled ? BUTTON_STATES.disabled.base : '',
  ];

  // Filter out any empty strings and join with a space.
  return classes.filter(Boolean).join(' ');
};

/**
 * Returns a string of classes for an icon based on its position and button size.
 *
 * @param {('left' | 'right')} position - The position of the icon.
 * @param {ButtonSize} size - The size variant of the button.
 * @returns {string} - The final className string for the icon.
 */
export const getIconClasses = (position: 'left' | 'right', size: ButtonSize): string => {
  return [
    BUTTON_SIZES[size].iconSize,
    position === 'left' ? BUTTON_LAYOUT.icon.left : BUTTON_LAYOUT.icon.right,
  ]
    .filter(Boolean)
    .join(' ');
};
