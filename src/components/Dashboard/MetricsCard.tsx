import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface MetricsCardProps {
  label: string;
  value: string;
  change: string;
  icon: LucideIcon;
  gradient: string;
}

const MetricsCard: React.FC<MetricsCardProps> = ({
  label,
  value,
  change,
  icon: Icon,
  gradient,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative group"
    >
      <div
        className={clsx(
          'relative overflow-hidden rounded-2xl border transition-all duration-300',
          'bg-gray-900/50 backdrop-blur-xl border-gray-800/50 hover:border-blue-500/30'
        )}
      >
        <div className="p-6">
          {/* Icon & Change */}
          <div className="flex items-center justify-between mb-4">
            <div
              className={clsx(
                'w-12 h-12 rounded-xl bg-gradient-to-r p-[1px] transition-transform duration-300 group-hover:scale-110',
                gradient
              )}
            >
              <div className="w-full h-full rounded-xl bg-gray-900 flex items-center justify-center">
                <Icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <span
              className={clsx(
                'text-sm font-medium',
                change.startsWith('+') ? 'text-green-400' : 'text-red-400'
              )}
            >
              {change}
            </span>
          </div>

          {/* Label & Value */}
          <div>
            <p className="text-gray-400 text-sm mb-1">{label}</p>
            <p
              className={clsx(
                'text-2xl font-bold bg-gradient-to-r bg-clip-text text-transparent',
                gradient
              )}
            >
              {value}
            </p>
          </div>
        </div>

        {/* Animated Border */}
        <div className="absolute inset-0 border border-transparent hover:border-blue-500/20 rounded-2xl transition-colors duration-300" />
      </div>

      {/* Hover Glow Effect */}
      <div
        className={clsx(
          'absolute -inset-2 bg-gradient-to-r rounded-3xl opacity-0 blur-xl transition-opacity duration-500 -z-10',
          gradient
        )}
      />
    </motion.div>
  );
};

export default React.memo(MetricsCard);
