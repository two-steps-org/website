import React from 'react';
import { motion } from 'framer-motion';
import { getButtonClasses, getIconClasses } from './utils';
import type { ButtonProps } from './types';

const LoadingSpinner: React.FC = () => (
  <div role="status" className="absolute inset-0 flex items-center justify-center">
    <svg
      className="animate-spin h-5 w-5 text-current"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    <span className="sr-only">Loading...</span>
  </div>
);

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon: Icon,
      iconPosition = 'right',
      fullWidth = false,
      responsive = true,
      loading = false,
      disabled = false,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;
    const buttonClasses = getButtonClasses({
      variant,
      size,
      fullWidth,
      responsive,
      loading,
      disabled: isDisabled
    });

    return (
      <motion.button
        ref={ref}
        whileHover={isDisabled ? undefined : { scale: 1.02 }}
        whileTap={isDisabled ? undefined : { scale: 0.98 }}
        className={`group ${buttonClasses} ${className}`}
        disabled={isDisabled}
        aria-busy={loading}
        {...props}
      >
        {loading && <LoadingSpinner />}
        <span
          aria-live="polite"
          className={`inline-flex items-center ${loading ? 'invisible' : ''}`}
        >
          {Icon && iconPosition === 'left' && (
            <Icon className={getIconClasses('left', size)} />
          )}
          <span>{children}</span>
          {Icon && iconPosition === 'right' && (
            <Icon className={getIconClasses('right', size)} />
          )}
        </span>
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
