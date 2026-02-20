import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import type { CaseStudy } from './types';

interface CaseStudyCardProps {
  study: CaseStudy;
  index: number;
  onSelect: () => void;
}

const CaseStudyCard: React.FC<CaseStudyCardProps> = ({ study, index, onSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="touch-manipulation pb-2"
    >
      <motion.div
        whileTap={{ scale: 0.98 }}
        onClick={onSelect}
        className="relative overflow-hidden rounded-2xl bg-gray-900/50 border border-gray-800/50 flex flex-col"
        style={{ minHeight: 520 }}
      >
        {/* ── Image ─────────────────────────────────────────── */}
        <div className="relative h-52 flex-shrink-0 overflow-hidden">
          <img
            src={study.image}
            alt={study.title}
            className="w-full h-full object-cover"
            loading="lazy"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/20 to-transparent" />
          {/* Subtle colour tint matching this study */}
          <div className={`absolute inset-0 bg-gradient-to-br ${study.gradient} opacity-[0.10]`} />

          {/* Badges over the image */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
            <span
              className={`text-xs font-semibold px-2.5 py-1 rounded-full bg-gradient-to-r ${study.gradient} text-white shadow-sm`}
            >
              {study.deployedPlatform}
            </span>
            <span className="text-xs text-gray-200 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/10">
              {study.industry}
            </span>
          </div>
        </div>

        {/* ── Content ───────────────────────────────────────── */}
        <div className="p-5 flex-1 flex flex-col">

          {/* Icon + title */}
          <div className="flex items-start gap-3 mb-3">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-r ${study.gradient} p-[1px] shrink-0 mt-0.5`}
            >
              <div className="w-full h-full rounded-xl bg-gray-900 flex items-center justify-center">
                <study.icon className="w-5 h-5 text-white" />
              </div>
            </div>
            <h3
              className={`text-lg font-bold bg-gradient-to-r ${study.gradient} bg-clip-text text-transparent leading-snug`}
            >
              {study.title}
            </h3>
          </div>

          {/* Description */}
          <p className="text-gray-300 text-sm leading-relaxed mb-5 line-clamp-2">
            {study.description}
          </p>

          {/* Metrics 2×2 */}
          <div className="grid grid-cols-2 gap-2 mb-5">
            {Object.entries(study.metrics).map(([key, value]) => (
              <div
                key={key}
                className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/30"
              >
                <p
                  className={`text-lg font-bold bg-gradient-to-r ${study.gradient} bg-clip-text text-transparent`}
                >
                  {value}
                </p>
                <p className="text-gray-500 text-xs mt-0.5 leading-tight">{key}</p>
              </div>
            ))}
          </div>

          {/* CTA row */}
          <div className="mt-auto flex items-center justify-between">
            <span className="text-sm font-semibold text-blue-400 flex items-center gap-1.5">
              View Full Study
              <ArrowRight className="w-4 h-4" />
            </span>
            <span className="text-xs text-gray-600">Tap to open</span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CaseStudyCard;
