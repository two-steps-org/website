import React from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  sectionKey: string;
  children: React.ReactNode;
  isMobile: boolean;
  isExpanded: boolean;
  reduceMotion: boolean | null;
  onToggle: (sectionKey: string) => void;
}

export default function CollapsibleSection({
  title,
  children,
  isMobile,
  isExpanded,
  reduceMotion,
  onToggle,
  sectionKey,
}: CollapsibleSectionProps) {
  if (!isMobile) {
    return (
      <div>
        <h3 className="text-lg font-semibold mb-6 text-ink">
          {title}
        </h3>
        {children}
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => onToggle(sectionKey)}
        className="w-full flex items-center justify-between py-4 border-b border-line min-h-[52px]"
        aria-expanded={isExpanded}
      >
        <h3 className="text-base font-semibold text-ink">
          {title}
        </h3>
        <m.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="text-muted"
        >
          <ChevronDown className="w-5 h-5" />
        </m.div>
      </button>
      <AnimatePresence>
        {isExpanded && (
          <m.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.3 }}
            className="overflow-hidden"
          >
            <div className="py-4">{children}</div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
