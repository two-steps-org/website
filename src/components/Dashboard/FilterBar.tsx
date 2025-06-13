import React from 'react';
import { Plus, LayoutGrid, Activity, Power } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface FilterBarProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ selectedFilter, onFilterChange }) => {
  // Utility function to get button classes based on active state and color gradient
  const getButtonClasses = (filter: string, gradient: string) =>
    clsx(
      'px-4 py-2 rounded-lg text-sm font-medium transition-all relative flex items-center gap-2',
      selectedFilter === filter
        ? 'text-white'
        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
    );

  return (
    <div className="flex justify-between items-center mb-8">
      <div className="flex items-center space-x-2 bg-white dark:bg-gray-900 p-1.5 rounded-xl shadow-sm dark:shadow-gray-900/50">
        <motion.button
          layout
          onClick={() => onFilterChange('all')}
          className={getButtonClasses('all', 'from-blue-500 to-blue-600')}
        >
          {selectedFilter === 'all' && (
            <motion.div
              layoutId="filter-active"
              className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg"
              initial={false}
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          <LayoutGrid className="w-4 h-4" />
          <span className="relative z-10">All Agents</span>
        </motion.button>

        <motion.button
          layout
          onClick={() => onFilterChange('active')}
          className={getButtonClasses('active', 'from-green-500 to-green-600')}
        >
          {selectedFilter === 'active' && (
            <motion.div
              layoutId="filter-active"
              className="absolute inset-0 bg-gradient-to-r from-green-500 to-green-600 rounded-lg"
              initial={false}
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          <Activity className="w-4 h-4" />
          <span className="relative z-10">Active</span>
        </motion.button>

        <motion.button
          layout
          onClick={() => onFilterChange('inactive')}
          className={getButtonClasses('inactive', 'from-red-500 to-red-600')}
        >
          {selectedFilter === 'inactive' && (
            <motion.div
              layoutId="filter-active"
              className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-600 rounded-lg"
              initial={false}
              transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
            />
          )}
          <Power className="w-4 h-4" />
          <span className="relative z-10">Inactive</span>
        </motion.button>
      </div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-lg shadow-blue-500/25"
      >
        <Plus className="w-4 h-4" />
        New Agent
      </motion.button>
    </div>
  );
};

export default React.memo(FilterBar);
