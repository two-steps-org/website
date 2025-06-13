import React from 'react';
import { LayoutDashboard, Users, BarChart2, Settings, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: Brain, label: 'AI Agents', active: true },
  { icon: Users, label: 'Users' },
  { icon: BarChart2, label: 'Analytics' },
  { icon: Settings, label: 'Settings' },
];

const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 bg-white dark:bg-gray-800/50 border-r border-gray-200 dark:border-gray-700/50">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-700/50">
        <img src="/two-steps-logo.png" alt="Two Steps" className="h-8" />
      </div>
      
      {/* Navigation */}
      <nav className="p-4">
        <div className="space-y-1">
          {menuItems.map((item, index) => {
            const itemClasses = clsx(
              'w-full px-4 py-2.5 flex items-center space-x-3 rounded-xl transition-colors',
              item.active
                ? 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50'
            );
            return (
              <motion.button
                key={index}
                whileHover={{ x: 4 }}
                className={itemClasses}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      </nav>
    </aside>
  );
};

export default React.memo(Sidebar);
