import React from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';
import clsx from 'clsx';
import { Status, AgentMetrics, GradientStyle } from '../types';

interface AgentCardProps {
  id: number;
  name: string;
  description: string;
  status: Status;
  metrics: AgentMetrics;
  icon: any;
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
  const gradientClass = `bg-gradient-to-r ${gradient}`;

  return (
    <motion.article
      whileHover={{ scale: 1.01 }}
      className="relative group h-full"
      aria-labelledby={`agent-${name}`}
    >
      <div className="relative h-full rounded-lg border bg-gray-900/55 backdrop-blur-sm border-gray-800/40 overflow-hidden">
        <div className="p-4 sm:p-5 flex flex-col h-full">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className={clsx('w-10 h-10 rounded-md p-[1px]', gradientClass)}>
                <div className="w-full h-full rounded-md bg-gray-900 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div>
                <h3
                  id={`agent-${name}`}
                  className={clsx(
                    'text-sm md:text-base font-semibold text-transparent bg-clip-text',
                    gradientClass,
                  )}
                >
                  {name}
                </h3>
                <p className="text-xs text-gray-400">{description}</p>
              </div>
            </div>

            {showStatus && (
              <div className="items-center gap-2 flex">
                <span className="flex items-center gap-1.5">
                  <Activity
                    className={clsx(
                      'w-3.5 h-3.5',
                      status === 'Active' ? 'text-green-400' : 'text-gray-400',
                    )}
                  />
                  <span
                    className={clsx(
                      'text-xs',
                      status === 'Active' ? 'text-green-400' : 'text-gray-400',
                    )}
                  >
                    {status}
                  </span>
                </span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 mb-3 flex-1">
            {Object.entries(metrics).map(([key, value]) => (
              <div key={key} className="bg-gray-900/40 rounded-md p-2 min-h-[44px]">
                <p className="text-xs text-gray-400">{key}</p>
                <p
                  className={clsx(
                    'text-sm font-semibold bg-clip-text text-transparent',
                    gradientClass,
                  )}
                >
                  {value}
                </p>
              </div>
            ))}
          </div>

          <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={clsx(
              'w-full py-2.5 rounded-md text-sm font-medium transition-all duration-150 min-h-[44px] focus:outline-none focus-visible:ring-2',
              isActive ? 'bg-red-500/10 text-red-400' : clsx('text-white', gradientClass),
            )}
            aria-pressed={isActive}
          >
            {isActive ? `End ${actionLabel.split(' ')[1] || 'Session'}` : actionLabel}
          </motion.button>
        </div>
      </div>
    </motion.article>
  );
};

export default React.memo(AgentCard);
