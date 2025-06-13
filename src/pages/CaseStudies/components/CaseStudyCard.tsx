import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { CaseStudy } from '../../../components/CaseStudies/types';

interface CaseStudyCardProps {
  study: CaseStudy;
  index: number;
  onSelect: (study: CaseStudy) => void;
  isMobile: boolean;
}

const CaseStudyCard: React.FC<CaseStudyCardProps> = ({
  study,
  index,
  onSelect,
  isMobile
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative"
    >
      {/* Main Card Container */}
      <div className="relative overflow-hidden rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 hover:border-blue-500/30 transition-all duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr,450px] gap-4">
          {/* Content Section */}
          <div className="p-6 flex flex-col justify-between">
            {/* Header */}
            <div className="flex items-start gap-4 mb-4">
              <div
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-r ${study.gradient} p-[1px] shrink-0`}
              >
                <div className="w-full h-full rounded-xl bg-gray-900 flex items-center justify-center">
                  <study.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <h3
                  className={`text-[20px] sm:text-[24px] md:text-[28px] font-bold bg-gradient-to-r ${study.gradient} bg-clip-text text-transparent truncate`}
                >
                  {study.title}
                </h3>
                <div className="flex flex-wrap gap-x-3 text-gray-400 text-[14px] sm:text-[16px] mt-1">
                  <p>{study.client}</p>
                  <span>•</span>
                  <p>{study.industry}</p>
                  <span>•</span>
                  <p>{study.deployedPlatform}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-4">
              <p className="text-gray-300 text-[16px] sm:text-[18px] leading-relaxed">
                {study.description}
              </p>
              {/* Learn More Button */}
              <motion.button
                onClick={() => onSelect(study)}
                className="mt-3 inline-flex items-center text-[14px] sm:text-[16px] font-medium transition-all duration-300 min-h-[44px] px-4 py-2"
              >
                <span
                  className={`bg-gradient-to-r ${study.gradient} bg-clip-text text-transparent`}
                >
                  Learn More
                </span>
                <ArrowRight
                  className="w-4 h-4 sm:w-5 sm:h-5 ml-1 text-gray-300 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300"
                />
              </motion.button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(study.metrics).map(([key, value]) => (
                <div
                  key={key}
                  className="bg-gray-800/50 rounded-xl p-2 sm:p-3 flex flex-col items-center justify-center"
                >
                  <p className="text-gray-400 text-[10px] sm:text-xs mb-1 text-center">
                    {key}
                  </p>
                  <p
                    className={`text-sm sm:text-base font-bold bg-gradient-to-r ${study.gradient} bg-clip-text text-transparent`}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Image Section */}
          {!isMobile && (
            <div className="relative h-full min-h-[350px] overflow-hidden">
              <img
                src={study.image}
                alt={study.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/50 to-transparent opacity-50" />
            </div>
          )}
        </div>
      </div>

      {/* Hover Glow Effect */}
      <div
        className={`absolute -inset-2 bg-gradient-to-r ${study.gradient} rounded-[2rem] opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 -z-10`}
      />
    </motion.div>
  );
};

export default CaseStudyCard;