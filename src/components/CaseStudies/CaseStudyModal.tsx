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
  // Map gradient to scrollbar style
  const getScrollbarStyle = (gradient?: string) => {
    if (!gradient) return '';
    if (gradient.includes('blue')) return 'modal-scrollbar-blue';
    if (gradient.includes('purple')) return 'modal-scrollbar-purple';
    if (gradient.includes('green')) return 'modal-scrollbar-green';
    if (gradient.includes('amber')) return 'modal-scrollbar-amber';
    if (gradient.includes('orange')) return 'modal-scrollbar-orange';
    if (gradient.includes('pink')) return 'modal-scrollbar-pink';
    if (gradient.includes('cyan')) return 'modal-scrollbar-cyan';
    return '';
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={study?.title}
      gradient={study?.gradient}
      icon={study && <study.icon className="w-6 h-6 text-white" />}
      maxWidth="2xl"
      scrollbarStyle={getScrollbarStyle(study?.gradient)}
    >
      <div className="p-5 space-y-4">
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
          <h4 className="text-lg font-semibold text-white mb-2">Overview</h4>
          <p className="text-gray-300 leading-relaxed">{study?.description}</p>
        </div>

        {/* Solution */}
        <div className="bg-gray-900/50 rounded-xl p-4">
          <h4 className="text-lg font-semibold text-white mb-2">Solution</h4>
          <p className="text-gray-300 leading-relaxed">{study?.solution}</p>
        </div>

        {/* Implementation Steps */}
        <div className="space-y-4">
          <h4 className="text-lg font-semibold text-white">Implementation</h4>
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
                    'text-base font-semibold mb-2',
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
                      <span className="text-gray-300 text-sm">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Button */}
      <div className="sticky bottom-0 p-5 bg-gradient-to-t from-black via-black/95 to-transparent">
        <motion.button
          onClick={onBookCall}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={clsx(
            'w-full bg-gradient-to-r',
            study?.gradient,
            'px-6 py-3 rounded-xl text-base text-white font-medium flex items-center justify-center gap-2',
            'hover:shadow-lg transition-all duration-300 touch-manipulation',
          )}
        >
          Book a Call
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </Modal>
  );
};

export default React.memo(CaseStudyModal);
