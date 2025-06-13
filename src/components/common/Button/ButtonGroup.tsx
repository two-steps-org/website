import React from 'react';
import type { ButtonGroupProps } from './types';
import clsx from 'clsx';

// Predefined spacing classes based on orientation and size.
const spacingClasses = {
  horizontal: {
    sm: 'space-x-2 md:space-x-2',
    md: 'space-x-3 md:space-x-4',
    lg: 'space-x-4 md:space-x-6',
  },
  vertical: {
    sm: 'space-y-2',
    md: 'space-y-3',
    lg: 'space-y-4',
  },
};

export const ButtonGroup: React.FC<ButtonGroupProps> = React.memo(
  ({
    children,
    orientation = 'horizontal',
    spacing = 'md',
    className = '',
    responsive = true,
  }) => {
    // Base classes depending on orientation and responsiveness.
    const baseClasses =
      orientation === 'horizontal'
        ? responsive
          ? 'flex flex-col md:flex-row w-full md:w-auto'
          : 'flex flex-row w-auto'
        : 'flex flex-col w-full md:w-auto';

    // Retrieve the appropriate spacing class.
    const spacingClass = spacingClasses[orientation][spacing];

    return (
      <div className={clsx(baseClasses, spacingClass, className)}>
        {children}
      </div>
    );
  }
);

ButtonGroup.displayName = 'ButtonGroup';
