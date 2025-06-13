/**
 * Button sizes and corresponding CSS classes.
 */
export const BUTTON_SIZES = {
  sm: {
    height: 'h-10',
    padding: 'px-4',
    fontSize: 'text-sm',
    iconSize: 'w-4 h-4',
  },
  md: {
    height: 'h-12',
    padding: 'px-6',
    fontSize: 'text-base',
    iconSize: 'w-5 h-5',
  },
  lg: {
    height: 'h-14',
    padding: 'px-8',
    fontSize: 'text-lg',
    iconSize: 'w-6 h-6',
  },
} as const;

/**
 * Button visual variants with base, hover, active, focus, and disabled states.
 */
export const BUTTON_VARIANTS = {
  primary: {
    base: 'bg-gradient-to-r from-blue-500 to-purple-500 text-white',
    hover: 'hover:shadow-lg hover:shadow-purple-500/25',
    active: 'active:shadow-none',
    focus: 'focus:ring-purple-500',
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
  },
  secondary: {
    base: 'bg-white/10 text-white backdrop-blur-sm border border-gray-700',
    hover: 'hover:bg-white/20 hover:border-blue-400',
    active: 'active:bg-white/15',
    focus: 'focus:ring-blue-400',
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
  },
  outline: {
    base: 'border border-gray-700 text-white',
    hover: 'hover:border-blue-400 hover:bg-blue-500/10',
    active: 'active:bg-blue-500/5',
    focus: 'focus:ring-blue-400',
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
  },
  gradient: {
    base: 'bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500 text-white bg-[length:200%_100%]',
    hover: 'hover:shadow-lg hover:shadow-purple-500/25 hover:bg-[100%_0]',
    active: 'active:shadow-none',
    focus: 'focus:ring-purple-500',
    disabled: 'disabled:opacity-50 disabled:cursor-not-allowed',
  },
} as const;

/**
 * Button state classes for loading and disabled states.
 */
export const BUTTON_STATES = {
  loading: {
    base: 'relative cursor-wait',
    content: 'invisible',
    spinner: 'absolute inset-0 flex items-center justify-center',
  },
  disabled: {
    base: 'cursor-not-allowed opacity-50',
  },
} as const;

/**
 * Base layout classes and responsive helpers for buttons.
 */
export const BUTTON_LAYOUT = {
  base: [
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
    'focus:outline-none',
    'focus:ring-2',
    'focus:ring-offset-2',
    'focus:ring-offset-black',
  ].join(' '),
  fullWidth: 'w-full',
  responsive: 'w-full md:w-auto',
  icon: {
    left: `-ml-1 mr-2 ${'group-hover:translate-x-0.5 transition-transform duration-300'}`,
    right: `-mr-1 ml-2 ${'group-hover:translate-x-0.5 transition-transform duration-300'}`,
  },
} as const;
