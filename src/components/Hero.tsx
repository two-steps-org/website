import React, { useCallback, useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { AINetworkVisualization } from './ui/AINetworkVisualization';
import Section from './common/Section';
import ErrorBoundary from './common/ErrorBoundary';
import SplitText from './common/SplitText';
import Parallax from './common/Parallax';
import { useDeviceType } from '../utils/responsive/hooks/useDeviceType';
import { BOOK_CALL_URL } from '../data/navItems';
import { enter, enterPop, enterScale } from '../utils/motion';

/** The four things we build, shown as glass chips under the CTAs. */
const CAPABILITY_CHIPS = [
  'AI Chat Agents',
  'AI Voice Agents',
  'CRM Development',
  'Custom SaaS',
] as const;

const Hero: React.FC = () => {
  const deviceType = useDeviceType();
  const isMobile = deviceType === 'mobile';
  const [showMobileVisualization, setShowMobileVisualization] = useState(!isMobile);

  useEffect(() => {
    if (!isMobile) {
      setShowMobileVisualization(true);
      return;
    }

    const REVEAL_SCROLL_Y = 120;
    const revealOnScroll = () => {
      setShowMobileVisualization(window.scrollY > REVEAL_SCROLL_Y);
    };

    revealOnScroll();
    window.addEventListener('scroll', revealOnScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', revealOnScroll);
    };
  }, [isMobile]);

  const handleBookCall = useCallback(() => {
    window.open(BOOK_CALL_URL, '_blank', 'noopener,noreferrer');
  }, []);

  // Choreography, on load: eyebrow → headline words rise out of their mask →
  // body → CTAs spring → chips slide in from the left → the visualization
  // powers on, then parallaxes as you scroll away. The whole composition
  // settles inside ~0.9s and the headline is visibly forming by ~150ms — a
  // blank hero for even half a second reads as broken.
  return (
    <Section className="relative overflow-hidden min-h-0 lg:min-h-[calc(100vh-80px)] flex items-center justify-center pt-36 pb-12 md:py-28 lg:pt-[calc(var(--header-height)+2rem)] lg:pb-20">
      <div className="grid lg:grid-cols-[1fr,1.1fr] items-center gap-8 lg:gap-8 w-full max-w-7xl mx-auto">
        {/* Left Column */}
        <div className="z-10 space-y-6 text-center lg:text-left flex flex-col justify-center h-full">
          <m.p {...enter(0)} className="ts-eyebrow">
            Custom Software &amp; AI Studio
          </m.p>

          {/* "Ahead" is one of the three serif-italic signature words allowed
              site-wide (the other is "vision", in the closing CTA). */}
          <SplitText
            as="h1"
            mode="enter"
            delay={0.05}
            stagger={0.035}
            className="ts-display -ml-[0.04em]"
            segments={[
              { text: 'Always Be' },
              { text: 'Ahead', className: 'sig' },
              { text: 'AI Built Just For You', breakBefore: true },
            ]}
          />

          <m.p {...enter(0.3)} className="ts-body max-w-2xl mx-auto lg:mx-0">
            At Two Steps, our process is simple: you bring the vision, we bring it to life.
            We craft custom AI solutions, turning complex challenges into seamless automation.
          </m.p>

          <div className="flex flex-col md:flex-row gap-3 pt-2 justify-center lg:justify-start w-full md:w-auto">
            <m.button
              {...enterPop(0, 0.4)}
              onClick={handleBookCall}
              className="ts-pill h-14 px-7 text-base w-full md:w-auto"
            >
              Book a Call
              <ArrowRight className="w-4 h-4" />
            </m.button>

            <m.div {...enterPop(1, 0.4)} className="w-full md:w-auto">
              <Link to="/case-studies" className="block w-full md:w-auto">
                <button className="ts-pill-ghost h-14 px-7 text-base w-full md:w-auto">
                  Case Studies
                </button>
              </Link>
            </m.div>
          </div>

          <ul className="flex flex-wrap gap-2 justify-center lg:justify-start list-none m-0 p-0 pt-2">
            {CAPABILITY_CHIPS.map((chip, i) => (
              <m.li
                key={chip}
                initial={{ opacity: 0, transform: 'translateX(-24px)' }}
                animate={{ opacity: 1, transform: 'translateX(0px)' }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1], delay: 0.5 + i * 0.05 }}
                className="ts-glass inline-flex items-center h-9 px-3.5 rounded-full text-[13px] font-medium text-ink"
              >
                {chip}
              </m.li>
            ))}
          </ul>
        </div>

        {/* Right Column - AI Network Visualization */}
        <Parallax distance={90} className="relative w-full">
          <m.div
            {...enterScale(0.2)}
            className={`relative w-full h-[320px] md:h-[500px] lg:h-[600px] mt-4 lg:mt-0 flex items-center justify-center select-none ${
              isMobile && !showMobileVisualization ? 'opacity-0 pointer-events-none' : ''
            }`}
          >
            <div className="w-full h-full relative flex items-center justify-center p-4">
              {(!isMobile || showMobileVisualization) && (
                <ErrorBoundary
                  fallback={
                    <div className="ts-card w-full h-full flex items-center justify-center">
                      <p className="text-muted">Visualization unavailable</p>
                    </div>
                  }
                >
                  <AINetworkVisualization simplified={isMobile} />
                </ErrorBoundary>
              )}
            </div>
          </m.div>
        </Parallax>
      </div>
    </Section>
  );
};

export default React.memo(Hero);
