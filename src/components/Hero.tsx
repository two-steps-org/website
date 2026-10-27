import React, { useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import Section from './common/Section';
import SplitText from './common/SplitText';
import { useBookCall } from './BookCall/useBookCall';
import { useReducedMotionQuery } from '../utils/scroll';
import { EASE_OUT, mainThread } from '../utils/motion';

// Naming these four is cleared (docs/copy-decisions.md, Correction 8).
// Describing the work is not; that waits for 09-questions B0 to B4.
const CLIENTS = ['EY', 'Bulthaup', 'Benchmark', 'Social Lady'] as const;

const Hero: React.FC = () => {
  const reduce = useReducedMotionQuery();
  const [fontsReady, setFontsReady] = useState(false);
  useEffect(() => {
    let active = true;
    // Only the display line waits for its face, and briefly. The paragraph and
    // the buttons are the LCP element, so they never wait.
    Promise.race([
      document.fonts.load('300 1em "Inter Tight"').catch(() => undefined),
      new Promise((resolve) => setTimeout(resolve, 300)),
    ]).then(() => {
      if (active) setFontsReady(true);
    });
    return () => {
      active = false;
    };
  }, []);
  const entrance = (delay: number) => ({
    ...mainThread,
    initial: reduce ? (false as const) : { opacity: 0, transform: 'translateY(12px)' },
    animate: { opacity: 1, transform: 'translateY(0px)' },
    transition: { type: 'tween' as const, duration: reduce ? 0 : 0.4, ease: EASE_OUT, delay: reduce ? 0 : delay },
  });
  const { open } = useBookCall();

  return (
    <Section
      data-layout="free"
      className="relative flex min-h-0 items-center overflow-hidden pt-[calc(var(--header-height)+1.5rem)] pb-12 md:pb-28 lg:min-h-[calc(100vh-80px)] lg:pt-[calc(var(--header-height)+2rem)] lg:pb-20"
    >
      <div
        data-scroll-hero="copy"
        className="z-10 flex max-w-[720px] flex-col gap-6 max-lg:min-h-[calc(100svh-var(--header-height)-1.5rem)] max-lg:justify-center"
      >
        <SplitText
          as="h1"
          mode="enter"
          ready={fontsReady}
          delay={0.05}
          stagger={0.035}
          className="ts-display -ml-[0.04em]"
          text="AI agents and software that run your operation."
        />

        <m.p {...entrance(0.25)} className="ts-body max-w-2xl">
          We scope the work, write the blueprint you own, then build and run the system. The people on the first call are the people who ship it.
        </m.p>

        <div className="flex w-full flex-col gap-3 pt-2 md:w-auto md:flex-row md:items-center">
          <m.div {...entrance(0.35)} className="w-full md:w-auto">
            <button type="button" onClick={open} className="ts-pill h-14 w-full px-7 text-base md:w-auto">
              Start a conversation
              <ArrowRight className="h-4 w-4" />
            </button>
          </m.div>
          <m.div {...entrance(0.35)} className="w-full md:w-auto">
            <Link to="/case-studies" className="ts-pill-ghost h-14 w-full px-7 text-base md:w-auto">
              See the work
            </Link>
          </m.div>
        </div>

        <m.p {...entrance(0.45)} className="m-0 flex flex-wrap items-baseline gap-x-4 gap-y-1 pt-4">
          <span className="font-mono text-[12px] uppercase tracking-[0.08em] text-muted">Delivered for</span>
          {CLIENTS.map((name) => (
            <span key={name} className="font-tight text-[15px] font-medium uppercase tracking-[0.14em] text-ink">
              {name}
            </span>
          ))}
        </m.p>
      </div>
      {/* Artefact slot (plan 2.1): the voice control when it is live, else a recording of an owned product. */}
    </Section>
  );
};

export default React.memo(Hero);
