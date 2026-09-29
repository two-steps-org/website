import React from 'react';
import { ArrowRight } from 'lucide-react';
import SplitText from './common/SplitText';
import Scrub from './common/Scrub';
import { useBookCall } from './BookCall/useBookCall';

/** The page's one loud ask. It sits where a visitor has just seen the work and
 * the quotes; the footer keeps a quiet button and no headline of its own. */
const CtaBand: React.FC = () => {
  const { open } = useBookCall();

  return (
    <section className="ts-section relative border-t border-line">
      <div className="ts-container flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
        <Scrub effect="signature">
          <SplitText
            as="h2"
            delay={0.05}
            stagger={0.05}
            className="ts-display m-0 max-w-[14ch] text-ink"
            segments={[{ text: 'Your business, two steps' }, { text: 'ahead.', className: 'sig' }]}
          />
        </Scrub>

        {/* Not scrubbed: the ask is never shown half-faded. */}
        <button type="button" onClick={open} className="ts-pill h-14 shrink-0 self-start px-7 text-base lg:self-auto">
          Start a conversation
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </section>
  );
};

export default React.memo(CtaBand);
