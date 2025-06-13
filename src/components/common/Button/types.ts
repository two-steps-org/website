import { LucideIcon } from 'lucide-react';
import { ButtonHTMLAttributes } from 'react';
import { BUTTON_VARIANTS, BUTTON_SIZES } from './constants';

/**
 * Defines the available visual variants for buttons.
 */
export type ButtonVariant = keyof typeof BUTTON_VARIANTS;

/**
 * Defines the available size options for buttons.
 */
export type ButtonSize = keyof typeof BUTTON_SIZES;

/**
 * Props for the Button component.
 */
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * The visual variant of the button.
   * @default 'primary'
   */
  variant?: ButtonVariant;
  /**
   * The size of the button.
   * @default 'md'
   */
  size?: ButtonSize;
  /**
   * Optional icon component to display within the button.
   */
  icon?: LucideIcon;
  /**
   * Position of the icon relative to the button content.
   * @default 'right'
   */
  iconPosition?: 'left' | 'right';
  /**
   * If true, the button will span the full width of its container.
   */
  fullWidth?: boolean;
  /**
   * Enables responsive width behavior. When true, the button is full width on small screens and auto on larger ones.
   * @default true
   */
  responsive?: boolean;
  /**
   * Displays a loading state on the button.
   */
  loading?: boolean;
  /**
   * The content to be displayed inside the button.
   */
  children: React.ReactNode;
}

/**
 * Props for the ButtonGroup component.
 */
export interface ButtonGroupProps {
  /**
   * Child elements (typically Button components).
   */
  children: React.ReactNode;
  /**
   * Orientation of the button group (horizontal or vertical).
   * @default 'horizontal'
   */
  orientation?: 'horizontal' | 'vertical';
  /**
   * Spacing between buttons in the group.
   * @default 'md'
   */
  spacing?: 'sm' | 'md' | 'lg';
  /**
   * Additional class names to apply to the ButtonGroup container.
   */
  className?: string;
  /**
   * Enables responsive behavior for the ButtonGroup layout.
   * @default true
   */
  responsive?: boolean;
}
