import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { Metric } from '../types';

interface MetricsGridProps {
  metrics: Metric[];
}

const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics }) => {
  return (
    <div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4"
      role="list"
      aria-label="Dashboard metrics"
    >
      {metrics.map((metric, idx) => {
        const positive = metric.change.startsWith('+');
        return (
          <motion.div
            key={`${metric.label}-${idx}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28, delay: idx * 0.06 }}
            role="listitem"
          >
            <div className="relative rounded-lg border bg-gray-900/55 backdrop-blur-sm border-gray-800/40 overflow-hidden">
              <div className="p-3 sm:p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={clsx('w-10 h-10 rounded-lg p-[1px] ', metric.gradient)}>
                    <div className="w-full h-full rounded-lg bg-gray-900 flex items-center justify-center">
                      <metric.icon className="w-4 h-4 text-white" aria-hidden />
                    </div>
                  </div>
                  <span
                    className={clsx(
                      'text-xs sm:text-sm font-medium',
                      positive ? 'text-green-400' : 'text-red-400',
                    )}
                  >
                    {metric.change}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-xs sm:text-sm text-gray-400">{metric.label}</p>
                  <p
                    className={clsx(
                      'text-base sm:text-lg font-bold bg-clip-text text-transparent',
                      metric.gradient,
                    )}
                    aria-label={`${metric.label}: ${metric.value}`}
                  >
                    {metric.value}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default React.memo(MetricsGrid);
