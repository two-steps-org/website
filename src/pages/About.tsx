import React from 'react';
import { m } from 'framer-motion';
import Team from '../components/Team';
import { CaseStudyClosingCta } from '../components/CaseStudies/CaseStudyDetailSections';
import SplitText from '../components/common/SplitText';
import { enter } from '../utils/motion';
import { usePageScrollReset } from '../utils/scroll';

const About: React.FC = () => {
  usePageScrollReset();

  return (
    <main className="relative w-full flex-1">
      <section className="pb-16" style={{ paddingTop: 'calc(var(--header-height) + 4rem)' }}>
        <div className="ts-container flex flex-col gap-6">
          <m.p {...enter(0)} className="ts-eyebrow">
            The studio
          </m.p>
          <SplitText
            as="h1"
            mode="enter"
            delay={0.1}
            stagger={0.08}
            className="ts-display m-0 max-w-[14ch] text-ink"
            text="Two Steps"
          />
          <m.p {...enter(0.3)} className="m-0 max-w-[48ch] text-[clamp(17px,1.4vw,19px)] text-muted">
            We build AI systems for companies with a standard to protect.
          </m.p>
          <m.p {...enter(0.4)} className="m-0 max-w-[48ch] text-[clamp(17px,1.4vw,19px)] text-muted">
            The studio is small on purpose. You work with the people making the thing — not an account manager relaying messages to a team you'll never meet.
          </m.p>
          {/* TODO Q6: founder paragraph. Do not publish until it is approved. */}
        </div>
      </section>

      <section className="border-t border-line">
        <div className="ts-container flex flex-col gap-10 py-[clamp(64px,8vw,112px)]">
          <h2 className="ts-h2 m-0 text-ink">How we work</h2>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-2">
            <div className="flex flex-col gap-3">
              <p className="ts-eyebrow m-0">One — Understand</p>
              <p className="m-0 max-w-[42ch] text-[17px] leading-[1.6] text-muted">
                Before we talk about budget or timelines, we work out what's actually being built. We sit with the people who'll use it, look at the systems already in place, and write the blueprint: what it does, what it touches, what it takes. You own that document whether or not we build it.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <p className="ts-eyebrow m-0">Two — Build</p>
              <p className="m-0 max-w-[42ch] text-[17px] leading-[1.6] text-muted">
                We design it, build it, integrate it and ship it. The same people who understood the problem deliver it. There is no handover, because there is nobody to hand it to.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="ts-container flex flex-col gap-4 py-[clamp(64px,8vw,112px)]">
          <h2 className="ts-h2 m-0 text-ink">What we won't do</h2>
          <p className="m-0 max-w-[48ch] text-[17px] leading-[1.6] text-muted">
            We don't take work we can't do properly. We'll say so on the first call, and point you somewhere better if we know of one.
          </p>
        </div>
      </section>

      <Team />

      <CaseStudyClosingCta />
    </main>
  );
};

export default About;
