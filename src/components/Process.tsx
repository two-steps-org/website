'use client';

import React, { memo, useRef } from 'react';
import { m } from 'framer-motion';
import clsx from 'clsx';
import { Search, Code2 } from 'lucide-react';
import Section from './common/Section';
import SplitText from './common/SplitText';
import Scrub from './common/Scrub';
import { useReducedMotionQuery, useSectionProgress } from '../utils/scroll';

const steps = [
  {
    step: 'One',
    title: 'Understand',
    fullDescription:
      "Before we talk about budget or timelines, we work out what's actually being built. We sit with the people who'll use it, look at the systems already in place, and write the blueprint: what it does, what it touches, what it takes. You own that document whether or not we build it.",
    icon: Search,
  },
  {
    step: 'Two',
    title: 'Build',
    fullDescription:
      'We design it, build it, integrate it and ship it. The same people who understood the problem deliver it. There is no handover, because there is nobody to hand it to.',
    icon: Code2,
  },
];

const DesktopStep: React.FC<{ step: (typeof steps)[number]; index: number }> = ({ step, index }) => {
  const left = index % 2 === 0;

  return (
    <div className={clsx('relative flex', left ? 'items-center justify-start' : 'items-center justify-end')}>
      <Scrub effect="timeline" x={left ? -48 : 48} y={0} className={clsx('w-[calc(50%-2rem)]', left ? 'pr-8' : 'pl-8')}>
        <div className="relative rounded-2xl border border-line ts-card p-6 shadow-lg transition-colors duration-200 hover:border-line-strong">
          <div className="mb-4 flex items-center gap-4">
            <div className="rounded-full bg-accent px-3 py-1">
              <span className="text-sm font-semibold text-accent-fg">{step.step}</span>
            </div>
            <h3 className="ts-h3 text-ink">{step.title}</h3>
          </div>
          <p className="text-sm leading-relaxed text-muted">{step.fullDescription}</p>
        </div>
      </Scrub>

      <div className="absolute left-1/2 -translate-x-1/2">
        <Scrub effect="focus" y={8} scale={0.92}>
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-line-strong ts-glass">
            <step.icon className="h-7 w-7 text-ink" />
          </div>
        </Scrub>
      </div>
    </div>
  );
};

const Process: React.FC = () => {
  const processRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotionQuery();
  const fill = useSectionProgress(processRef, ['start center', 'end center']);

  return (
    <Section id="process" ref={processRef}>
      <div className="relative">
        <Scrub y={32} className="mb-8 lg:mb-16">
          <p className="ts-eyebrow mb-4">Two steps</p>
          <SplitText as="h2" delay={0.1} className="ts-h2 mb-6 text-ink" text="Complex work, delivered simply." />
        </Scrub>

        <div className="relative hidden lg:block">
          <div className="absolute left-1/2 h-full w-[3px] -translate-x-[1.5px] bg-ink/10">
            <m.div
              className="absolute inset-0 origin-top bg-ink"
              style={reduce ? undefined : { scaleY: fill }}
            />
          </div>

          <div className="space-y-12">
            {steps.map((step, index) => (
              <DesktopStep key={step.title} step={step} index={index} />
            ))}
          </div>
        </div>

        <div className="relative block space-y-10 lg:hidden">
          {steps.map((step) => {
            return (
              <Scrub key={step.title} effect="timeline" x={-28} className="relative">
                <div className="relative mt-4 touch-manipulation rounded-2xl ts-card p-6">
                  <div className="mb-2 w-fit rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-accent-fg">
                    {step.step}
                  </div>
                  <h3 className="ts-h3 mb-3 text-ink">{step.title}</h3>
                  <p className="text-base leading-relaxed text-muted">{step.fullDescription}</p>
                </div>
              </Scrub>
            );
          })}

        </div>
      </div>
    </Section>
  );
};

export default memo(Process);
