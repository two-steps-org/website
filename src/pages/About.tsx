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
            About
          </m.p>
          <SplitText
            as="h1"
            mode="enter"
            delay={0.1}
            stagger={0.08}
            className="ts-display m-0 max-w-[14ch] text-ink"
            segments={[{ text: 'The team that keeps you' }, { text: 'ahead.', className: 'sig' }]}
          />
          <m.p {...enter(0.3)} className="m-0 max-w-[48ch] text-[clamp(17px,1.4vw,19px)] text-muted">
            Here is how we work, and who you will be working with.
          </m.p>
        </div>
      </section>

      <Team />

      <CaseStudyClosingCta />
    </main>
  );
};

export default About;
