import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, Plus } from 'lucide-react';
import clsx from 'clsx';
import { ErrorBoundary } from '../../common/ErrorBoundary';

interface DashboardContainerProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  gradient: string;
  buttonLabel?: string;
  onAddNew?: () => void;
  children: React.ReactNode;
}

const DashboardContainer: React.FC<DashboardContainerProps> = ({
  title,
  subtitle,
  icon: Icon,
  gradient,
  buttonLabel,
  onAddNew,
  children,
}) => {
  // keep gradient class stable reference
  const gradientClass = `bg-gradient-to-r ${gradient}`;

  return (
    <div className="relative min-h-[420px]">
      <div className={clsx('absolute inset-0 rounded-[1.5rem] p-[1px]', gradientClass)} aria-hidden>
        <div className="absolute inset-0 backdrop-blur-sm rounded-[1.5rem] bg-gray-900/95" />
      </div>

      <div className="relative p-4 sm:p-6 md:p-8 rounded-[1.2rem] text-white">
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 sm:mb-6">
          <div className="flex items-center gap-3">
            <div className={clsx('w-10 h-10 sm:w-12 sm:h-12 rounded-lg p-[1px] ', gradientClass)}>
              <div className="w-full h-full rounded-lg bg-gray-900 flex items-center justify-center">
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
                {title}
              </h2>
              <p className="text-xs sm:text-sm text-gray-400">{subtitle}</p>
            </div>
          </div>

          {buttonLabel && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onAddNew}
              className={clsx(
                'px-3 sm:px-4 hidden md:flex py-2 rounded-md font-medium items-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1',
                gradientClass,
              )}
            >
              <Plus className="w-4 h-4" />
              <span className="text-sm">{buttonLabel}</span>
            </motion.button>
          )}
        </header>

        <ErrorBoundary>
          <main className="space-y-6">{children}</main>
        </ErrorBoundary>
      </div>

      <div
        className={clsx(
          'absolute -inset-2 rounded-[1.6rem] opacity-6 blur-md -z-10',
          gradientClass,
        )}
        aria-hidden
      />
    </div>
  );
};

export default React.memo(DashboardContainer);
