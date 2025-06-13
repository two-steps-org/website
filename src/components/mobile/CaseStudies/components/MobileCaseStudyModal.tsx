import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Modal from '../../../common/Modal';
import type { CaseStudy } from '../../../../components/CaseStudies/types';

interface MobileCaseStudyModalProps {
  study: CaseStudy | null;
  onClose: () => void;
  onBookCall: () => void;
}

const MobileCaseStudyModal: React.FC<MobileCaseStudyModalProps> = ({
  study,
  onClose,
  onBookCall
}) => {
  if (!study) return null;

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={study.title}
      gradient={study.gradient}
      icon={<study.icon className="w-5 h-5 text-white" />}
      maxWidth="xl"
    >
      <div className="flex flex-col h-[calc(100dvh-65px)]">
        {/* Header Info */}
        <div className="px-3 py-1.5 border-b border-gray-800/50 bg-gray-900/50">
          <div className="flex items-center gap-1.5 text-xs text-gray-400">
            <span>{study.client}</span>
            <span>•</span>
            <span>{study.industry}</span>
            <span>•</span>
            <span>{study.deployedPlatform}</span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4 custom-scrollbar">
          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(study.metrics).map(([key, value]) => (
              <div key={key} className="bg-gray-900/50 rounded-lg p-3">
                <p className="text-gray-400 text-xs mb-1">{key}</p>
                <p className={`text-sm font-bold bg-gradient-to-r ${study.gradient} bg-clip-text text-transparent`}>
                  {value}
                </p>
              </div>
            ))}
          </div>

          {/* Description */}
          <div className="bg-gray-900/50 rounded-lg p-4">
            <h4 className="text-base font-semibold text-white mb-2">Overview</h4>
            <p className="text-gray-300 text-sm leading-relaxed">{study.description}</p>
          </div>

          {/* Solution */}
          <div className="bg-gray-900/50 rounded-lg p-4">
            <h4 className="text-base font-semibold text-white mb-2">Solution</h4>
            <p className="text-gray-300 text-sm leading-relaxed">{study.solution}</p>
          </div>

          {/* Implementation Steps */}
          <div className="space-y-3">
            <h4 className="text-base font-semibold text-white">Implementation</h4>
            {study.implementation.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="bg-gray-900/50 rounded-lg p-4 border border-gray-800/50">
                  <h5 className={`text-sm font-semibold bg-gradient-to-r ${study.gradient} bg-clip-text text-transparent mb-2`}>
                    {index + 1}. {step.title}
                  </h5>
                  <ul className="space-y-2">
                    {step.details.map((detail, detailIndex) => (
                      <li key={detailIndex} className="flex items-start gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${study.gradient} mt-1.5 shrink-0`} />
                        <span className="text-gray-300 text-xs">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div className="sticky bottom-0 p-4 bg-gradient-to-t from-black via-black/95 to-transparent">
          <motion.button
            onClick={onBookCall}
            whileTap={{ scale: 0.98 }}
            className={`w-full bg-gradient-to-r ${study.gradient} px-6 py-3 rounded-xl text-sm text-white font-medium flex items-center justify-center gap-2 hover:shadow-lg transition-all duration-300 touch-manipulation min-h-[44px]`}
          >
            Book a Call
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </Modal>
  );
};

export default MobileCaseStudyModal;