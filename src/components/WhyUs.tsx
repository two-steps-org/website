'use client';

import React, { useState } from 'react';
import clsx from 'clsx';
import {
  m,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { BrainCircuit, PencilRuler, Plug, ShieldCheck, TrendingUp, Users, type LucideIcon } from 'lucide-react';
import Section from './common/Section';
import SplitText from './common/SplitText';
import Scrub from './common/Scrub';
import { useReducedMotionQuery } from '../utils/scroll';

const slides = [
  {
    number: '01',
    icon: PencilRuler,
    headline: 'Built for Your Business',
    description:
      'Our AI solutions are custom-built to fit your goals, industry, and challenges—because your business deserves more than one-size-fits-all.',
  },
  {
    number: '02',
    icon: Plug,
    headline: 'Effortless Integration',
    description:
      'Seamlessly connect our AI solutions with your existing tools and workflows, ensuring zero downtime and immediate results.',
  },
  {
    number: '03',
    icon: BrainCircuit,
    headline: 'Intelligence You Can Trust',
    description:
      'Our AI agents are designed with precision, delivering reliable, consistent results that you can count on.',
  },
  {
    number: '04',
    icon: TrendingUp,
    headline: 'Evolving with Your Needs',
    description:
      "Our solutions grow with you, adapting to your business's evolution so you're always ready for what's next.",
  },
  {
    number: '05',
    icon: ShieldCheck,
    headline: 'Security at the Core',
    description:
      'Every AI solution we build is designed with advanced data protection, keeping your operations secure at every step.',
  },
  {
    number: '06',
    icon: Users,
    headline: 'Expertise You Can Rely On',
    description:
      'Our team of specialists works closely with you, from concept to delivery, to ensure your AI vision becomes a reality.',
  },
] as const;

const SLIDE_COUNT = slides.length;
/** Pinned scroll per slide, in vh. Every slide, the last included, holds this long. */
const STEP_VH = 55;
const HOLD = 0.86;
const FLIP = 1 - HOLD;
const HALF = 0.5;
const FLIP_DEG = 38;
const PERSPECTIVE = 1400;
/** Site ease-out: cubic-bezier(0.23, 1, 0.32, 1) approximated for scroll sampling. */
const easeOut = (t: number) => 1 - (1 - Math.min(1, Math.max(0, t))) ** 3;

type FlipState = {
  opacity: number;
  rotateX: number;
  scale: number;
  y: number;
  z: number;
};

const hidden: FlipState = { opacity: 0, rotateX: FLIP_DEG, scale: 0.97, y: 16, z: 0 };

const slideAt = (sp: number) => {
  const current = Math.min(Math.floor(sp), SLIDE_COUNT - 1);
  return { current, step: sp - current };
};

/** Index shown in the rail — updates after the outgoing slide has left. */
const visibleIndex = (sp: number) => {
  const { current, step } = slideAt(sp);
  if (step >= HOLD + FLIP * HALF) return Math.min(current + 1, SLIDE_COUNT - 1);
  return current;
};

/** Hold one readable slide, then a sequential flip. Never two headlines at once. */
const slideFlipState = (sp: number, index: number): FlipState => {
  const { current, step } = slideAt(sp);

  if (index < current || index > current + 1) return hidden;
  if (step < HOLD) {
    return index === current
      ? { opacity: 1, rotateX: 0, scale: 1, y: 0, z: 1 }
      : hidden;
  }

  const t = (step - HOLD) / FLIP;

  if (index === current) {
    if (t >= HALF) return hidden;
    const p = easeOut(t / HALF);
    return {
      opacity: 1 - p,
      rotateX: -p * FLIP_DEG,
      scale: 1 - p * 0.03,
      y: -p * 20,
      z: 2,
    };
  }

  if (current >= SLIDE_COUNT - 1 || t < HALF) return hidden;
  const p = easeOut((t - HALF) / HALF);
  return {
    opacity: p,
    rotateX: (1 - p) * FLIP_DEG,
    scale: 0.97 + p * 0.03,
    y: (1 - p) * 20,
    z: 2,
  };
};

const WhySlideBody: React.FC<{ slide: (typeof slides)[number] }> = ({ slide }) => (
  <div className="flex w-full max-w-[52rem] items-center gap-[clamp(20px,3.5vw,36px)]">
    <span
      aria-hidden="true"
      className="font-tight w-[2.2ch] shrink-0 select-none text-right text-[clamp(64px,8.5vw,120px)] font-light leading-none tracking-[-0.05em] text-muted/22"
    >
      {slide.number}
    </span>
    <div className="h-[clamp(72px,12vh,140px)] w-px shrink-0 bg-line" aria-hidden="true" />
    <div className="flex min-w-0 flex-col justify-center py-2">
      <h3 className="ts-display m-0 mb-5 max-w-[14ch] text-ink">{slide.headline}</h3>
      <p className="ts-body m-0 max-w-[38ch]">{slide.description}</p>
    </div>
  </div>
);

/** Static on purpose: it rides the slide's flip, so it must not animate itself. */
const SlideGlyph: React.FC<{ icon: LucideIcon }> = ({ icon: Icon }) => (
  <div
    aria-hidden="true"
    className="relative flex aspect-square w-[clamp(200px,24vw,340px)] shrink-0 items-center justify-center"
  >
    <span className="absolute inset-0 rounded-full border border-line" />
    <span className="absolute inset-[15%] rounded-full border border-line" />
    <span className="ts-card flex h-[42%] w-[42%] items-center justify-center rounded-full">
      <Icon strokeWidth={1} className="h-[46%] w-[46%] text-ink" />
    </span>
  </div>
);

const WhySlide: React.FC<{ slide: (typeof slides)[number]; compact?: boolean }> = ({
  slide,
  compact,
}) => (
  <article className={clsx('flex w-full items-center', compact ? 'py-10' : 'h-full')}>
    <WhySlideBody slide={slide} />
  </article>
);

const FlipSlide: React.FC<{
  slide: (typeof slides)[number];
  index: number;
  progress: MotionValue<number>;
}> = ({ slide, index, progress }) => {
  const transform = useTransform(progress, (sp) => {
    const { rotateX, scale, y } = slideFlipState(sp, index);
    return `perspective(${PERSPECTIVE}px) translateY(${y}px) rotateX(${rotateX}deg) scale(${scale})`;
  });
  const opacity = useTransform(progress, (sp) => slideFlipState(sp, index).opacity);
  const zIndex = useTransform(progress, (sp) => slideFlipState(sp, index).z);

  return (
    <m.div
      className="pointer-events-none absolute inset-0 flex items-center justify-between gap-8 pr-[clamp(16px,4vw,72px)]"
      style={{
        transform,
        opacity,
        zIndex,
        transformOrigin: '50% 42%',
      }}
    >
      <WhySlideBody slide={slide} />
      <SlideGlyph icon={slide.icon} />
    </m.div>
  );
};

const FlipStage: React.FC<{ progress: MotionValue<number> }> = ({ progress }) => (
  <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden" data-why-us-stage>
    {slides.map((slide, index) => (
      <FlipSlide key={slide.number} slide={slide} index={index} progress={progress} />
    ))}
  </div>
);

const SectionHeader: React.FC<{ className?: string }> = ({ className }) => (
  <Scrub y={24} className={className}>
    <p className="ts-eyebrow mb-3">Why us</p>
    <SplitText
      as="h2"
      delay={0.1}
      className="ts-h2 m-0 text-ink"
      text="What Sets Us Apart"
    />
  </Scrub>
);

const ActiveSlideAnnouncer: React.FC<{ active: MotionValue<number> }> = ({ active }) => {
  const [announcement, setAnnouncement] = useState(`${slides[0].number}. ${slides[0].headline}`);
  useMotionValueEvent(active, 'change', (i) => {
    const slide = slides[Math.round(i)];
    if (slide) setAnnouncement(`${slide.number}. ${slide.headline}`);
  });
  return (
    <p className="sr-only" aria-live="polite">
      {announcement}
    </p>
  );
};

const IndexMark: React.FC<{ index: number; active: MotionValue<number> }> = ({ index, active }) => {
  const opacity = useTransform(active, (i) => (Math.round(i) === index ? 1 : 0.28));
  const transform = useTransform(active, (i) =>
    Math.round(i) === index ? 'translateX(0px)' : 'translateX(2px)',
  );

  return (
    <m.span
      className="block font-tight text-[13px] font-medium tabular-nums tracking-[0.08em] text-ink"
      style={{ opacity, transform }}
    >
      {slides[index].number}
    </m.span>
  );
};

const ScrollProgressRail: React.FC<{
  progress: MotionValue<number>;
  active: MotionValue<number>;
}> = ({ progress, active }) => {
  const fill = useTransform(progress, [0, 1], [0, 1]);
  const [label, setLabel] = useState('01 / 06');

  useMotionValueEvent(active, 'change', (i) => {
    const step = String(Math.round(i) + 1).padStart(2, '0');
    setLabel(`${step} / 06`);
  });

  return (
    <aside
      className="flex h-[min(248px,38vh)] shrink-0 flex-col items-end justify-center self-center"
      aria-label="Why us progress"
    >
      <div className="flex min-h-0 flex-1 items-stretch gap-4">
        <div className="relative w-px bg-line" aria-hidden="true">
          <m.div className="absolute inset-x-0 top-0 h-full origin-top bg-ink" style={{ scaleY: fill }} />
        </div>
        <ol className="m-0 flex list-none flex-col justify-between p-0 py-0.5">
          {slides.map((slide, index) => (
            <li key={slide.number} className="leading-none">
              <IndexMark index={index} active={active} />
            </li>
          ))}
        </ol>
      </div>
      <p className="ts-eyebrow m-0 mt-5 tabular-nums leading-none" data-why-us-progress>
        <span className="text-ink">{label.slice(0, 2)}</span>
        <span className="text-muted">{label.slice(2)}</span>
      </p>
    </aside>
  );
};

const DesktopScrollShowcase: React.FC = () => {
  const sectionRef = React.useRef<HTMLElement>(null);
  const reduce = useReducedMotionQuery();
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // One equal segment per slide; the last one holds to the end of the pin
  // instead of appearing just as the section lets go.
  const slideProgress = useTransform(scrollYProgress, (p) => Math.min(p * SLIDE_COUNT, SLIDE_COUNT - 1));
  const activeSlide = useTransform(slideProgress, visibleIndex);

  if (reduce) {
    return (
      <section className="ts-section relative hidden border-t border-line lg:block">
        <div className="ts-container">
          <SectionHeader className="mb-12 lg:mb-16" />
          <div className="space-y-16">
            {slides.map((slide) => (
              <WhySlide key={slide.number} slide={slide} compact />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      data-pin
      data-layout="free"
      data-scroll-slideshow="why-us"
      className="relative hidden border-t border-line lg:block"
      style={{ height: `${SLIDE_COUNT * STEP_VH + 100}vh` }}
    >
      <div className="sticky top-0 flex h-screen flex-col overflow-hidden">
        <div className="ts-container relative flex h-full flex-col">
          <SectionHeader className="shrink-0 pt-[calc(var(--header-height)+1.5rem)] pb-6 lg:pb-8" />

          <ActiveSlideAnnouncer active={activeSlide} />

          <div className="relative flex min-h-0 flex-1 items-stretch gap-8 pb-10 lg:gap-12">
            <FlipStage progress={slideProgress} />
            <ScrollProgressRail progress={scrollYProgress} active={activeSlide} />
          </div>
        </div>
      </div>
    </section>
  );
};

const WhyUs: React.FC = () => {
  return (
    <div id="why-us" data-pin>
      <DesktopScrollShowcase />

      <Section className="border-t border-line lg:hidden">
        <SectionHeader className="mb-10 md:mb-12" />

        <div className="space-y-2">
          {slides.map((slide) => (
            <Scrub key={slide.number} effect="focus" y={20}>
              <WhySlide slide={slide} compact />
            </Scrub>
          ))}
        </div>
      </Section>
    </div>
  );
};

export default WhyUs;
