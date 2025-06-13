import React, { forwardRef, memo } from 'react';
import clsx from 'clsx';

interface SectionProps {
  /** Child elements to be displayed within the section. */
  children: React.ReactNode;
  /** Additional class names for styling. */
  className?: string;
  /** Optional ID for the section (useful for in-page navigation). */
  id?: string;
}

/**
 * A flexible section component with padding and a default min-height.
 * Utilizes a forwardRef for advanced use cases.
 */
const BaseSection = forwardRef<HTMLElement, SectionProps>(
  ({ children, className = '', id }, ref) => {
    return (
      <section
        ref={ref}
        id={id}
        className={clsx(
          'relative w-full min-h-[calc(100vh-80px)] flex flex-col justify-center py-16 lg:py-24 scroll-mt-20',
          className
        )}
      >
        <div className="relative z-10 w-full max-w-7xl mx-auto px-8">
          {children}
        </div>
      </section>
    );
  }
);

BaseSection.displayName = 'Section';

/**
 * Memoize the forwardRef component to optimize re-renders
 * when props do not change.
 */
const Section = memo(BaseSection);

export default Section;
