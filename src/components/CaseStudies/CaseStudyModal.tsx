import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Modal from '../common/Modal';
import type { CaseStudy } from './types';
import clsx from 'clsx';

interface CaseStudyModalProps {
  study?: CaseStudy;
  isOpen: boolean;
  onClose: () => void;
  onBookCall: () => void;
}

const CaseStudyModal: React.FC<CaseStudyModalProps> = ({ study, isOpen, onClose, onBookCall }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={study?.title}
      gradient={study?.gradient}
      icon={study && <study.icon className="w-5 h-5 text-white" />}
      maxWidth="xl"
    >
      <div className="flex flex-col h-[calc(100dvh-65px)] sm:h-[min(600px,80vh)]">
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-4 sm:space-y-6 custom-scrollbar">
          {/* Client & Industry Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-900/50 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Client</p>
              <p className="text-white font-medium">{study?.client}</p>
            </div>
            <div className="bg-gray-900/50 rounded-xl p-4">
              <p className="text-gray-400 text-sm mb-1">Industry</p>
              <p className="text-white font-medium">{study?.industry}</p>
            </div>
          </div>

          {/* Description */}
          <div className="bg-gray-900/50 rounded-xl p-4">
            <h4 className="text-base sm:text-lg font-semibold text-white mb-2">Overview</h4>
            <p className="text-gray-300 leading-relaxed">{study?.description}</p>
          </div>

          {/* Solution */}
          <div className="bg-gray-900/50 rounded-xl p-4">
            <h4 className="text-base sm:text-lg font-semibold text-white mb-2">Solution</h4>
            <p className="text-gray-300 leading-relaxed">{study?.solution}</p>
          </div>

          {/* Implementation Steps */}
          <div className="space-y-3 sm:space-y-4">
            <h4 className="text-base sm:text-lg font-semibold text-white">Implementation</h4>
            {study?.implementation.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-800/50">
                  <h5
                    className={clsx(
                      'text-sm sm:text-base font-semibold mb-2',
                      `bg-gradient-to-r ${study?.gradient} bg-clip-text text-transparent`,
                    )}
                  >
                    {index + 1}. {step.title}
                  </h5>
                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start gap-2">
                        <div
                          className={clsx(
                            'w-1.5 h-1.5 rounded-full mt-1.5 shrink-0',
                            `bg-gradient-to-r ${study?.gradient}`,
                          )}
                        />
                        <span className="text-gray-300 text-xs sm:text-sm">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="sticky bottom-0 p-4 sm:p-6 bg-gradient-to-t from-black via-black/95 to-transparent">
          <motion.button
            onClick={onBookCall}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={clsx(
              'w-full bg-gradient-to-r',
              study?.gradient,
              'px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base text-white font-medium flex items-center justify-center gap-2',
              'hover:shadow-lg transition-all duration-300 touch-manipulation',
              'min-h-[44px] sm:min-h-[48px] my-2 sm:my-0',
            )}
          >
            Book a Call
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.button>
        </div>
      </div>
    </Modal>
  );
};

export default React.memo(CaseStudyModal);
