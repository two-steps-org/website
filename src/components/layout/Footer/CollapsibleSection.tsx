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
        type="button"
        onClick={() => onToggle(sectionKey)}
        className="flex min-h-[52px] w-full cursor-pointer items-center justify-between border-b border-line py-4"
        aria-expanded={isExpanded}
      >
        <h3 className="text-base font-semibold text-ink">
          {title}
        </h3>
        <m.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.2 }}
          className="text-muted"
        >
          <ChevronDown className="w-5 h-5" />
        </m.div>
      </button>
      <m.div layout transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.23, 1, 0.32, 1] }}>
        <AnimatePresence>
          {isExpanded && (
            <m.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.22, ease: [0.23, 1, 0.32, 1] }}
            >
              <m.div layout="position" className="py-4">{children}</m.div>
            </m.div>
          )}
        </AnimatePresence>
      </m.div>
    </div>
  );
}
