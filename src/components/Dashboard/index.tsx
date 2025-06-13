import React from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="relative min-h-[600px] bg-gradient-to-br from-gray-900 to-black rounded-[2.5rem] overflow-hidden border border-gray-800/50">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]"></div>
        <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-blue-500/5 rounded-full filter blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-purple-500/5 rounded-full filter blur-[120px] animate-pulse"></div>
      </div>

      <div className="relative p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-500 p-[1px] mx-auto mb-6">
            <div className="w-full h-full rounded-2xl bg-gray-900 flex items-center justify-center">
              <Brain className="w-10 h-10 text-white" />
            </div>
          </div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-white mb-4"
          >
            New Dashboard Coming Soon
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-400"
          >
            We're working on something amazing for you
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;