import { cva } from 'class-variance-authority';

// Base button styles with variant, size, and layout customizations.
export const buttonStyles = cva(
  [
    // Base layout & interactivity
    'relative',
    'inline-flex',
    'items-center',
    'justify-center',
    'font-medium',
    'transition-all',
    'duration-300',
    'rounded-xl',
    'min-h-[44px]',
    'min-w-[44px]',
    'disabled:opacity-50',
    'disabled:cursor-not-allowed',
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'focus:ring-offset-black',
    'active:scale-[0.98]',
    'touch-manipulation',
  ],
  {
    variants: {
      // Visual appearance of the button
      variant: {
        primary: [
          'bg-gradient-to-r',
          'from-blue-500',
          'to-purple-500',
          'text-white',
          'hover:shadow-lg',
          'hover:shadow-purple-500/25',
          'active:shadow-none',
          'focus:ring-purple-500',
        ],
        secondary: [
          'bg-white/10',
          'text-white',
          'backdrop-blur-sm',
          'hover:bg-white/20',
          'border',
          'border-gray-700',
          'hover:border-blue-400',
          'focus:ring-blue-400',
        ],
        outline: [
          'border',
          'border-gray-700',
          'text-white',
          'hover:border-blue-400',
          'hover:bg-blue-500/10',
          'focus:ring-blue-400',
        ],
        gradient: [
          'bg-gradient-to-r',
          'from-blue-500',
          'via-purple-500',
          'to-blue-500',
          'text-white',
          'hover:shadow-lg',
          'hover:shadow-purple-500/25',
          'bg-[length:200%_100%]',
          'hover:bg-[100%_0]',
          'transition-[background-position]',
          'duration-500',
          'focus:ring-purple-500',
        ],
      },
      // Size variants for padding and font sizes
      size: {
        sm: ['px-4', 'py-2.5', 'text-sm'],
        md: ['px-6', 'py-3', 'text-base'],
        lg: ['px-8', 'py-4', 'text-lg'],
      },
      // Layout options for full width buttons
      fullWidth: {
        true: ['w-full'],
        false: ['w-auto'],
      },
      // Responsive helper: ensures full width on mobile and auto width on larger screens
      responsive: {
        true: ['w-full', 'md:w-auto'],
        false: ['w-auto'],
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      fullWidth: false,
      responsive: true,
    },
  }
);

// Icon styling helper for buttons.
export const iconStyles = {
  wrapper: 'inline-flex items-center gap-2',
  left: '-ml-1',
  right: '-mr-1',
  animate: 'group-hover:translate-x-0.5 transition-transform duration-300',
};

// Loading state styles for buttons.
export const loadingStyles = {
  wrapper: 'absolute inset-0 flex items-center justify-center',
  spinner: 'animate-spin h-5 w-5 text-current',
};
