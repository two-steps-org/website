import React from 'react';
import { motion } from 'framer-motion';
import { Metric } from '../types';
import clsx from 'clsx';

interface MetricsGridProps {
  metrics: Metric[];
}

const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics }) => {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6"
      role="list"
      aria-label="Dashboard Metrics"
    >
      {metrics.map((metric, index) => (
        <motion.div
          key={`${metric.label}-${index}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
          className="relative group"
          role="listitem"
        >
          <div
            className={clsx(
              'relative overflow-hidden rounded-xl border transition-all duration-300',
              'bg-gray-900/50 backdrop-blur-xl border-gray-800/50 hover:border-blue-500/30'
            )}
          >
            <div className="p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div
                  className={clsx(
                    'w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-r p-[1px] transition-transform duration-300 group-hover:scale-110',
                    metric.gradient
                  )}
                >
                  <div className="w-full h-full rounded-lg bg-gray-900 flex items-center justify-center">
                    <metric.icon className="w-4 h-4 sm:w-5 sm:h-5 text-white" aria-hidden="true" />
                  </div>
                </div>
                <span
                  className={clsx(
                    'text-xs sm:text-sm font-medium',
                    metric.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                  )}
                  aria-label={`Change: ${metric.change}`}
                >
                  {metric.change}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-gray-400 text-xs sm:text-sm">{metric.label}</p>
                <p
                  className={clsx(
                    'text-base sm:text-lg font-bold bg-gradient-to-r bg-clip-text text-transparent',
                    metric.gradient
                  )}
                  aria-label={`${metric.label}: ${metric.value}`}
                >
                  {metric.value}
                </p>
              </div>
            </div>
          </div>

          {/* Hover Glow Effect */}
          <div
            className={clsx(
              'absolute -inset-1.5 bg-gradient-to-r rounded-2xl opacity-0 blur-xl transition-opacity duration-500 -z-10',
              metric.gradient
            )}
            aria-hidden="true"
          />
        </motion.div>
      ))}
    </div>
  );
};

export default React.memo(MetricsGrid);
