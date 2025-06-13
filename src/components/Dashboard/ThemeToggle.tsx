import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useDashboard } from './DashboardContext';
import clsx from 'clsx';

const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleDarkMode } = useDashboard();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleDarkMode}
      className={clsx(
        'p-2.5 rounded-xl transition-all duration-300',
        isDarkMode
          ? 'bg-gray-800/50 hover:bg-gray-700/50 text-yellow-400'
          : 'bg-white/10 hover:bg-white/20 text-gray-400'
      )}
    >
      {isDarkMode ? (
        <Sun className="w-5 h-5" />
      ) : (
        <Moon className="w-5 h-5" />
      )}
    </motion.button>
  );
};

export default React.memo(ThemeToggle);
