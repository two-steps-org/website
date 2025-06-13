import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { CaseStudy } from './types';
import clsx from 'clsx';

interface CaseStudyCardProps {
  study: CaseStudy;
  index: number;
  onSelect: (study: CaseStudy) => void;
}

const CaseStudyCard: React.FC<CaseStudyCardProps> = ({ study, index, onSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={clsx('group', 'relative')}
    >
      <div
        className={clsx(
          'relative',
          'overflow-hidden',
          'rounded-3xl',
          'bg-gray-900/50',
          'backdrop-blur-xl',
          'border',
          'border-gray-800/50',
          'hover:border-blue-500/30',
          'transition-all',
          'duration-300'
        )}
      >
        <div className={clsx('grid', 'grid-cols-1', 'lg:grid-cols-2', 'gap-8', 'p-8')}>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div
                className={clsx(
                  'w-14',
                  'h-14',
                  'rounded-xl',
                  'p-[1px]',
                  'shrink-0',
                  `bg-gradient-to-r ${study.gradient}`
                )}
              >
                <div className="w-full h-full rounded-xl bg-gray-900 flex items-center justify-center">
                  <study.icon className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h3
                  className={clsx(
                    'text-2xl',
                    'font-bold',
                    'truncate',
                    `bg-gradient-to-r ${study.gradient} bg-clip-text text-transparent`
                  )}
                >
                  {study.title}
                </h3>
                <div className="flex flex-wrap gap-x-4 text-gray-400 text-sm mt-0.5">
                  <p>Client: {study.client}</p>
                  <p>Industry: {study.industry}</p>
                  <p>Platform: {study.deployedPlatform}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-gray-300 leading-relaxed">{study.description}</p>

              <button
                onClick={() => onSelect(study)}
                className="flex items-center text-sm font-medium group/btn"
              >
                <span
                  className={clsx(
                    `bg-gradient-to-r ${study.gradient} bg-clip-text text-transparent`
                  )}
                >
                  Learn More
                </span>
                <ArrowRight
                  className={clsx(
                    'w-4',
                    'h-4',
                    'ml-1',
                    'opacity-0',
                    'group-hover/btn:opacity-100',
                    'transform',
                    '-translate-x-2',
                    'group-hover/btn:translate-x-0',
                    'transition-all',
                    'duration-300',
                    `${study.gradient} bg-clip-text`
                  )}
                />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {Object.entries(study.metrics).map(([key, value]) => (
                <div key={key} className="bg-gray-800/50 rounded-xl p-4">
                  <p className="text-gray-400 text-sm mb-1">{key}</p>
                  <p
                    className={clsx(
                      'text-xl',
                      'font-bold',
                      `bg-gradient-to-r ${study.gradient} bg-clip-text text-transparent`
                    )}
                  >
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative h-[300px] lg:h-auto rounded-xl overflow-hidden">
            <img
              src={study.image}
              alt={study.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent opacity-60" />
          </div>
        </div>
      </div>

      <div
        className={clsx(
          'absolute',
          '-inset-2',
          `bg-gradient-to-r ${study.gradient}`,
          'rounded-[2rem]',
          'opacity-0',
          'group-hover:opacity-10',
          'blur-xl',
          'transition-opacity',
          'duration-500',
          '-z-10'
        )}
      />
    </motion.div>
  );
};

export default React.memo(CaseStudyCard);
