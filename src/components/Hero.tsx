import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { AINetworkVisualization } from './ui/AINetworkVisualization';
import Section from './common/Section';
import Parallax from './common/Parallax';
import ErrorBoundary from './common/ErrorBoundary';
import SplitText from './common/SplitText';
import { useDeviceType } from '../utils/responsive/hooks/useDeviceType';
import { BOOK_CALL_URL } from '../data/navItems';
import { useReducedMotionQuery } from '../utils/scroll';
import { EASE_OUT, enterScale, mainThread } from '../utils/motion';

/** The four things we build, shown as glass chips under the CTAs. */
const CAPABILITY_CHIPS = [
  'AI Chat Agents',
  'AI Voice Agents',
  'CRM Development',
  'Custom SaaS',
] as const;

const Hero: React.FC = () => {
  const heroRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotionQuery();
  const [fontsReady, setFontsReady] = useState(false);
  useEffect(() => {
    let active = true;
    // Hold every entrance until the hero's own typefaces are in. On a cold
    // load `fonts.ready` resolves before the faces even start downloading
    // (nothing is loading yet), so it must be the explicit loads that gate:
    // otherwise the swap reflows the copy while everything is mid-flight.
    // Capped so a blocked font CDN cannot leave the hero invisible.
    const faces = ['300 1em "Inter Tight"', '1em Inter', 'italic 1em "Instrument Serif"'];
    Promise.race([
      Promise.all(faces.map(face => document.fonts.load(face))).then(() => document.fonts.ready),
      new Promise(resolve => setTimeout(resolve, 1200)),
    ]).then(() => {
      if (active) setFontsReady(true);
    });
    return () => { active = false; };
  }, []);
  const ready = reduce || fontsReady;
  const entrance = (delay: number, horizontal = false) => ({
    ...mainThread,
    initial: reduce ? false as const : { opacity: 0, transform: horizontal ? 'translateX(-16px)' : 'translateY(12px)' },
    // Motion cannot interpolate to 'none'; it would snap instead of easing.
    animate: ready ? { opacity: 1, transform: horizontal ? 'translateX(0px)' : 'translateY(0px)' } : undefined,
    transition: { type: 'tween' as const, duration: reduce ? 0 : 0.4, ease: EASE_OUT, delay: reduce ? 0 : delay },
  });
  const deviceType = useDeviceType();
  const isMobile = deviceType === 'mobile';
  const handleBookCall = useCallback(() => {
    window.open(BOOK_CALL_URL, '_blank', 'noopener,noreferrer');
  }, []);

  return (
    <Section ref={heroRef}
      className="relative flex min-h-0 items-center justify-center overflow-hidden pt-36 pb-12 md:py-28 lg:min-h-[calc(100vh-80px)] lg:pt-[calc(var(--header-height)+2rem)] lg:pb-20"
    >
      <div className="grid w-full items-center gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-8">
        <div
          data-scroll-hero="copy"
          className="z-10 flex h-full flex-col justify-center space-y-6 text-center lg:justify-start lg:text-left"
        >
          <SplitText
            as="h1"
            mode="enter"
            ready={fontsReady}
            delay={0.05}
            stagger={0.035}
            className="ts-display -ml-[0.04em]"
            segments={[
              { text: 'Always Be' },
              { text: 'Ahead', className: 'sig' },
              { text: 'AI Built Just For You', breakBefore: true },
            ]}
          />

          <m.p {...entrance(0.25)} className="ts-body mx-auto max-w-2xl lg:mx-0">
            At Two Steps, our process is simple: you bring the vision, we bring it to life.
            We craft custom AI solutions, turning complex challenges into seamless automation.
          </m.p>

          <div className="flex w-full flex-col justify-center gap-3 pt-2 md:w-auto md:flex-row md:items-center lg:justify-start">
            <m.div {...entrance(0.35)} className="w-full md:w-auto">
              <button
                type="button"
                onClick={handleBookCall}
                className="ts-pill h-14 w-full px-7 text-base md:w-auto"
              >
                Book a Call
                <ArrowRight className="h-4 w-4" />
              </button>
            </m.div>

            <m.div {...entrance(0.35)} className="w-full md:w-auto">
              <Link
                to="/case-studies"
                className="ts-pill-ghost h-14 w-full px-7 text-base md:w-auto"
              >
                Case Studies
              </Link>
            </m.div>
          </div>

          <ul className="m-0 flex list-none flex-wrap justify-center gap-2 p-0 pt-2 lg:justify-start">
            {CAPABILITY_CHIPS.map((chip, index) => (
              <m.li
                key={chip}
                {...entrance(0.45 + index * 0.05, true)}
                className="ts-glass inline-flex h-9 items-center rounded-full px-3.5 text-[13px] font-medium text-ink"
              >
                {chip}
              </m.li>
            ))}
          </ul>
        </div>

        <Parallax distance={90} className="relative w-full">
          <m.div
            data-scroll-hero="scene"
            {...(reduce ? mainThread : enterScale(0.2))}
            className="relative mt-4 flex h-[320px] w-full select-none items-center justify-center md:h-[500px] lg:mt-0 lg:h-[600px]"
          >
            <div className="relative flex h-full w-full items-center justify-center p-4 lg:p-0">
              <ErrorBoundary
                fallback={
                  <div className="flex h-full w-full items-center justify-center ts-card">
                    <p className="text-muted">Visualization unavailable</p>
                  </div>
                }
              >
                <AINetworkVisualization simplified={isMobile} />
              </ErrorBoundary>
            </div>
          </m.div>
        </Parallax>
      </div>
    </Section>
  );
};

export default React.memo(Hero);
