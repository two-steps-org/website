import React from 'react';
import { motion } from 'framer-motion';
import { Activity, LucideIcon } from 'lucide-react';
import { Status, GradientStyle, AgentMetrics } from '../types';
import clsx from 'clsx';

interface AgentCardProps {
  id: number;
  name: string;
  description: string;
  status: Status;
  metrics: AgentMetrics;
  icon: LucideIcon;
  gradient: GradientStyle;
  isActive: boolean;
  onClick: () => void;
  actionLabel?: string;
  showStatus?: boolean;
}

const AgentCard: React.FC<AgentCardProps> = ({
  name,
  description,
  status,
  metrics,
  icon: Icon,
  gradient,
  isActive,
  onClick,
  actionLabel = 'Start Session',
  showStatus = true,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="relative group h-full"
      role="article"
      aria-label={`${name} - ${status}`}
    >
      <div
        className={clsx(
          'relative h-full overflow-hidden rounded-xl border transition-all duration-300',
          'bg-gray-900/50 backdrop-blur-xl border-gray-800/50 hover:border-blue-500/30'
        )}
      >
        <div className="p-4 sm:p-6 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="flex items-center gap-3">
              <div
                className={clsx(
                  'w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-r p-[1px] transition-transform duration-300',
                  'group-hover:scale-110',
                  gradient
                )}
              >
                <div className="w-full h-full rounded-lg bg-gray-900 flex items-center justify-center">
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" aria-hidden="true" />
                </div>
              </div>
              <div>
                <h3
                  className={clsx(
                    'text-base sm:text-lg font-bold',
                    'bg-gradient-to-r bg-clip-text text-transparent',
                    gradient
                  )}
                >
                  {name}
                </h3>
                <p className="text-xs sm:text-sm text-gray-400">{description}</p>
              </div>
            </div>
            {showStatus && (
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5">
                  <Activity
                    className={clsx(
                      'w-3.5 h-3.5',
                      status === 'Active' ? 'text-green-400' : 'text-gray-400'
                    )}
                    aria-hidden="true"
                  />
                  <span
                    className={clsx(
                      'text-xs',
                      status === 'Active' ? 'text-green-400' : 'text-gray-400'
                    )}
                    role="status"
                  >
                    {status}
                  </span>
                </span>
              </div>
            )}
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-3 sm:mb-4 flex-1" role="list">
            {Object.entries(metrics).map(([key, value]) => (
              <div
                key={key}
                className="bg-gray-900/50 rounded-lg p-2 sm:p-3 backdrop-blur-sm"
                role="listitem"
              >
                <p className="text-gray-400 text-xs mb-0.5">{key}</p>
                <p
                  className={clsx(
                    'text-sm sm:text-base font-semibold',
                    'bg-gradient-to-r bg-clip-text text-transparent',
                    gradient
                  )}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={clsx(
              'w-full py-2.5 rounded-lg text-sm font-medium transition-all duration-300 min-h-[44px]',
              isActive
                ? 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                : clsx('bg-gradient-to-r text-white opacity-90 hover:opacity-100', gradient)
            )}
            aria-pressed={isActive}
          >
            {isActive ? `End ${actionLabel.split(' ')[1]}` : actionLabel}
          </motion.button>
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div
        className={clsx(
          'absolute -inset-1.5 bg-gradient-to-r rounded-2xl opacity-0 blur-xl transition-opacity duration-500 -z-10',
          gradient
        )}
        aria-hidden="true"
      />
    </motion.div>
  );
};

export default React.memo(AgentCard);
