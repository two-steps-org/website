import React from 'react';
import { Search, MessageSquare, Bell, X } from 'lucide-react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface HeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, onSearchChange }) => {
  // Format current date
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  // Navigation tabs with active style applied to the second tab ("All Agents")
  const tabs = ['Dashboard', 'All Agents', 'Account', 'Knowledge Base', 'Overview'];

  return (
    <header className="bg-white dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700/50">
      <div className="px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Left side: Title & Date */}
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{currentDate}</p>
          </div>

          {/* Right side: Search and actions */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-64 bg-gray-50 dark:bg-gray-900/50 rounded-lg pl-10 pr-4 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500/50 border border-gray-200 dark:border-gray-700/50"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg relative">
              <MessageSquare className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-blue-500 rounded-full" />
            </button>

            <button className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-lg relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-blue-500 rounded-full" />
            </button>

            <motion.div
              whileHover={{ scale: 1.05 }}
              className="h-8 w-8 rounded-lg bg-blue-500 flex items-center justify-center text-white font-medium cursor-pointer"
            >
              JD
            </motion.div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-8 mt-6">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              className={clsx(
                'text-sm font-medium pb-2 border-b-2 transition-colors',
                index === 1
                  ? 'text-blue-500 border-blue-500'
                  : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              )}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default React.memo(Header);
