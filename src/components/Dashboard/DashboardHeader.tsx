import React from 'react';
import { motion } from 'framer-motion';
import { Plus, LucideIcon } from 'lucide-react';
import clsx from 'clsx';

interface DashboardHeaderProps {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  buttonLabel: string;
  gradientFrom: string;
  gradientTo: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  title,
  subtitle,
  icon: Icon,
  buttonLabel,
  gradientFrom,
  gradientTo,
}) => {
  const iconContainerClass = clsx(
    'w-12 h-12 rounded-xl bg-gradient-to-r p-[1px]',
    `from-${gradientFrom}`,
    `to-${gradientTo}`
  );
  
  const iconClass = clsx('w-6 h-6', `text-${gradientFrom}`);
  
  const buttonClass = clsx(
    'bg-gradient-to-r text-white px-4 py-2.5 rounded-xl font-medium transition-all duration-300 flex items-center gap-2',
    `from-${gradientFrom}`,
    `to-${gradientTo}`,
    'hover:shadow-lg',
    `hover:shadow-${gradientFrom}/25`
  );
  
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={iconContainerClass}>
          <div className="w-full h-full rounded-xl bg-gray-900 flex items-center justify-center">
            <Icon className={iconClass} />
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white mb-1">{title}</h2>
          <p className="text-gray-400">{subtitle}</p>
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={buttonClass}
      >
        <Plus className="w-5 h-5" />
        {buttonLabel}
      </motion.button>
    </div>
  );
};

export default React.memo(DashboardHeader);
