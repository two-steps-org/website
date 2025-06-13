import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { CaseStudy } from '../../../components/CaseStudies/types';

interface TabletCaseStudyCardProps {
  study: CaseStudy;
  index: number;
  onSelect: () => void;
}

const TabletCaseStudyCard: React.FC<TabletCaseStudyCardProps> = ({
  study,
  index,
  onSelect
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group touch-manipulation"
    >
      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={onSelect}
        className="relative overflow-hidden rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 h-full"
      >
        {/* Image */}
        <div className="relative h-56">
          <img 
            src={study.image} 
            alt={study.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start gap-4 mb-6">
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${study.gradient} p-[1px] shrink-0`}>
              <div className="w-full h-full rounded-xl bg-gray-900 flex items-center justify-center">
                <study.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className={`text-xl font-bold bg-gradient-to-r ${study.gradient} bg-clip-text text-transparent mb-2`}>
                {study.title}
              </h3>
              <div className="flex flex-wrap gap-x-3 text-gray-400 text-sm">
                <p>{study.client}</p>
                <span>•</span>
                <p>{study.industry}</p>
              </div>
            </div>
          </div>

          <p className="text-gray-300 text-base mb-6 line-clamp-3">
            {study.description}
          </p>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {Object.entries(study.metrics).map(([key, value]) => (
              <div key={key} className="bg-gray-800/50 rounded-xl p-3">
                <p className="text-gray-400 text-sm mb-1">{key}</p>
                <p className={`text-base font-bold bg-gradient-to-r ${study.gradient} bg-clip-text text-transparent`}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* View Details Button */}
          <button className="flex items-center text-base font-medium text-blue-400 group/btn">
            View Details
            <ArrowRight className="w-5 h-5 ml-1 opacity-0 group-hover/btn:opacity-100 transform -translate-x-2 group-hover/btn:translate-x-0 transition-all duration-300" />
          </button>
        </div>

        {/* Active State Indicator */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5">
          <div className={`h-full bg-gradient-to-r ${study.gradient} transform scale-x-0 group-active:scale-x-100 transition-transform duration-200 origin-left`} />
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TabletCaseStudyCard;