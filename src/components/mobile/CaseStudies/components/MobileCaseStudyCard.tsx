import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { CaseStudy } from '../../../../components/CaseStudies/types';

interface MobileCaseStudyCardProps {
  study: CaseStudy;
  index: number;
  onSelect: () => void;
}

const MobileCaseStudyCard: React.FC<MobileCaseStudyCardProps> = ({
  study,
  index,
  onSelect
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group touch-manipulation h-full"
    >
      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={onSelect}
        className="relative overflow-hidden rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 h-full flex flex-col"
      >
        {/* Image */}
        <div className="relative h-48">
          <img 
            src={study.image} 
            alt={study.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <div className="flex items-start gap-3 mb-3">
            <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${study.gradient} p-[1px] shrink-0`}>
              <div className="w-full h-full rounded-lg bg-gray-900 flex items-center justify-center">
                <study.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <h3 className={`text-lg font-bold bg-gradient-to-r ${study.gradient} bg-clip-text text-transparent mb-1`}>
                {study.title}
              </h3>
              <div className="flex flex-wrap gap-x-2 text-gray-400 text-xs">
                <p>{study.client}</p>
                <span>•</span>
                <p>{study.industry}</p>
              </div>
            </div>
          </div>

          <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-2">
            {study.description}
          </p>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-2 mb-4 mt-auto">
            {Object.entries(study.metrics).map(([key, value]) => (
              <div key={key} className="bg-gray-800/50 rounded-lg p-2">
                <p className="text-gray-400 text-xs mb-0.5">{key}</p>
                <p className={`text-sm font-bold bg-gradient-to-r ${study.gradient} bg-clip-text text-transparent`}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Learn More Button */}
          <div className="flex items-center text-sm font-medium text-blue-400 group/btn">
            Learn More
            <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover/btn:opacity-100 transform -translate-x-2 group-hover/btn:translate-x-0 transition-all duration-300" />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MobileCaseStudyCard;