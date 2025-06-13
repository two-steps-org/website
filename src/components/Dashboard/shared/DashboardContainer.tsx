import React from 'react';
import { motion } from 'framer-motion';
import { Plus, LucideIcon } from 'lucide-react';
import { ErrorBoundary } from './ErrorBoundary';
import { GradientStyle } from '../types';
import clsx from 'clsx';

interface DashboardContainerProps {
  /** Title displayed in the header */
  title: string;
  /** Subtitle displayed under the title */
  subtitle: string;
  /** Icon component to represent the dashboard */
  icon: LucideIcon;
  /** Tailwind CSS gradient classes (e.g., "from-blue-500 to-purple-500") */
  gradient: GradientStyle;
  /** Label for the action button */
  buttonLabel: string;
  /** Optional callback for adding a new item */
  onAddNew?: () => void;
  /** Main dashboard content */
  children: React.ReactNode;
}

/**
 * DashboardContainer wraps the dashboard content with a premium gradient border, a header section,
 * and an error boundary around the content area.
 */
const DashboardContainer: React.FC<DashboardContainerProps> = ({
  title,
  subtitle,
  icon: Icon,
  gradient,
  buttonLabel,
  onAddNew,
  children,
}) => {
  return (
    <div className="relative min-h-[600px]" role="region" aria-label={title}>
      {/* Premium Dashboard Border */}
      <div className={clsx('absolute inset-0 rounded-[2rem] p-[1px] bg-gradient-to-r', gradient)}>
        <div className="absolute inset-0 backdrop-blur-xl rounded-[2rem] bg-gray-900/95" />
      </div>

      {/* Content */}
      <div className="relative p-6 sm:p-8 rounded-[2rem] text-white">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className={clsx('w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-gradient-to-r p-[1px] group', gradient)}>
              <div className="w-full h-full rounded-lg sm:rounded-xl bg-gray-900 flex items-center justify-center">
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" aria-hidden="true" />
              </div>
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-bold text-white mb-1 flex items-center gap-2">
                {title}
                <Icon className={clsx('w-4 h-4 sm:w-5 sm:h-5 bg-gradient-to-r bg-clip-text text-transparent', gradient)} />
              </h2>
              <p className="text-sm sm:text-base text-gray-400">{subtitle}</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onAddNew}
            className={clsx(
              'bg-gradient-to-r px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl font-medium text-white flex items-center gap-2 hover:shadow-lg hover:shadow-white/10 transition-all duration-300 min-h-[44px]',
              gradient
            )}
            aria-label={buttonLabel}
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5" aria-hidden="true" />
            {buttonLabel}
          </motion.button>
        </header>

        {/* Dashboard Content with Error Boundary */}
        <ErrorBoundary>
          <main className="space-y-4 sm:space-y-6">{children}</main>
        </ErrorBoundary>
      </div>

      {/* Background Glow */}
      <div
        className={clsx(
          'absolute -inset-3 bg-gradient-to-r',
          gradient,
          'rounded-[2.5rem] opacity-5 blur-2xl -z-10'
        )}
        aria-hidden="true"
      />
    </div>
  );
};

export default React.memo(DashboardContainer);
