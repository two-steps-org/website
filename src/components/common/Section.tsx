import React, { forwardRef, memo } from 'react';
import clsx from 'clsx';

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  /** Child elements to be displayed within the section. */
  children: React.ReactNode;
}

/**
 * A chapter section: shared vertical rhythm and the shared container.
 * Utilizes a forwardRef for advanced use cases.
 */
const BaseSection = forwardRef<HTMLElement, SectionProps>(
  ({ children, className = '', ...rest }, ref) => {
    return (
      <section
        ref={ref}
        {...rest}
        className={clsx(
          'ts-section relative w-full flex flex-col justify-center',
          className,
        )}
      >
        <div className="ts-container relative z-10">
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
