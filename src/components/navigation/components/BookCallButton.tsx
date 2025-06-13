import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface BookCallButtonProps {
  onClick: () => void;
  className?: string;
}

const BookCallButton: React.FC<BookCallButtonProps> = ({ onClick, className = '' }) => {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg font-medium hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 flex items-center gap-2 ${className}`}
    >
      <span>Book a Call</span>
      <ArrowRight className="w-4 h-4" />
    </motion.button>
  );
};

export default BookCallButton;