import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { caseStudies } from './data';

interface CaseStudiesFiltersProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    industry: string;
    service: string;
    year: string;
  };
  onFiltersChange: (filters: { industry: string; service: string; year: string }) => void;
}

const CaseStudiesFilters: React.FC<CaseStudiesFiltersProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
}) => {
  // Get unique values for filters
  const industries = Array.from(new Set(caseStudies.map((study) => study.industry)));
  const services = Array.from(new Set(caseStudies.map((study) => study.deployedPlatform)));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Filters Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30 }}
            className="absolute right-0 top-0 bottom-0 w-[300px] bg-gray-900/95 backdrop-blur-xl"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-800/50 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white">Filters</h3>
              <button onClick={onClose} aria-label="Close filters" className="p-2 rounded-lg bg-gray-800/50">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            {/* Filter Options */}
            <div className="p-4 space-y-6">
              {/* Industry Filter */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-400">Industry</h4>
                <select
                  value={filters.industry}
                  onChange={(e) => onFiltersChange({ ...filters, industry: e.target.value })}
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white"
                >
                  <option value="">All Industries</option>
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </div>

              {/* Service Filter */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-400">Service</h4>
                <select
                  value={filters.service}
                  onChange={(e) => onFiltersChange({ ...filters, service: e.target.value })}
                  className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-3 py-2 text-white"
                >
                  <option value="">All Services</option>
                  {services.map((service) => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))}
                </select>
              </div>

              {/* Reset Button */}
              <button
                onClick={() => onFiltersChange({ industry: '', service: '', year: '' })}
                className="w-full bg-gray-800/50 border border-gray-700/50 rounded-lg px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Reset Filters
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CaseStudiesFilters;
