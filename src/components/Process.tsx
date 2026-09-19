'use client';

import React, { memo, useRef, useState } from 'react';
import { m } from 'framer-motion';
import clsx from 'clsx';
import { Search, Lightbulb, Code2, Rocket, RefreshCw, ChevronDown } from 'lucide-react';
import Section from './common/Section';
import SplitText from './common/SplitText';
import Scrub from './common/Scrub';
import { useReducedMotionQuery, useSectionProgress } from '../utils/scroll';

const steps = [
  {
    step: 'Step 01',
    title: 'Discovery Call',
    shortDescription: 'We begin with a consultation call to understand your vision and goals.',
    fullDescription:
      "We begin with a one-on-one consultation call to understand your vision, challenges, and goals. This call helps us explore your unique needs and identify areas where AI can deliver the most impact. It's the foundation for building a solution tailored to your business.",
    icon: Search,
  },
  {
    step: 'Step 02',
    title: 'Tailored Solution Design',
    shortDescription: 'Our team designs a personalized AI solution aligned with your operations.',
    fullDescription:
      "Our expert team designs a personalized AI solution. From defining the AI's personality to building its knowledge base and mapping out workflows, we ensure every detail aligns seamlessly with your operations and business goals.",
    icon: Lightbulb,
  },
  {
    step: 'Step 03',
    title: 'Development & Integration',
    shortDescription: 'We develop and integrate your AI solution with your existing platforms.',
    fullDescription:
      'Using the latest AI technology, we bring your solution to life. Our seamless integration process ensures your AI tools connect effortlessly with your existing platforms, providing a smooth and efficient experience for your team and customers.',
    icon: Code2,
  },
  {
    step: 'Step 04',
    title: 'Deployment & Training',
    shortDescription: 'We launch your AI solution and provide comprehensive training for your team.',
    fullDescription:
      'Your AI solution is launched! We embed it into your business operations and provide comprehensive training for your team, equipping them to maximize its potential and achieve immediate results.',
    icon: Rocket,
  },
  {
    step: 'Step 05',
    title: 'Continuous Optimization',
    shortDescription: 'We continuously monitor and optimize your AI solution as your business grows.',
    fullDescription:
      "Our commitment doesn't end with deployment. We continuously monitor performance, refine capabilities, and scale your solution as your business grows. This ensures you remain ahead in the fast-paced AI landscape.",
    icon: RefreshCw,
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
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [showAllMobile, setShowAllMobile] = useState(false);
  const toggleStep = (title: string) => {
    setExpandedStep(expandedStep === title ? null : title);
  };

  const fill = useSectionProgress(processRef, ['start center', 'end center']);

  return (
    <Section id="process" ref={processRef}>
      <div className="relative">
        <Scrub y={32} className="mb-8 lg:mb-16">
          <p className="ts-eyebrow mb-4">OUR PROCESS</p>
          <SplitText as="h2" delay={0.1} className="ts-h2 mb-6 text-ink" text="How We Transform Your Business" />
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
          {steps.map((step, index) => {
            if (index >= 2 && !showAllMobile) return null;
            return (
              <Scrub key={step.title} effect="timeline" x={-28} className="relative">
                <div className="relative mt-4 touch-manipulation rounded-2xl ts-card p-6">
                  <div className="mb-2 w-fit rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-accent-fg">
                    {step.step}
                  </div>
                  <h3 className="ts-h3 mb-3 text-ink">{step.title}</h3>
                  <p className="text-base leading-relaxed text-muted">
                    {expandedStep === step.title ? step.fullDescription : step.shortDescription}
                  </p>
                  <button
                    type="button"
                    onClick={() => toggleStep(step.title)}
                    aria-expanded={expandedStep === step.title}
                    className="ts-icon-btn group/see mt-5 flex min-h-[44px] w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-line bg-ink/5 py-3 text-sm font-medium text-ink hover:bg-ink/10 active:bg-ink/15"
                  >
                    <span>{expandedStep === step.title ? 'See Less' : 'See More'}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-ink transition-transform duration-300 ${expandedStep === step.title ? 'rotate-180' : ''
                        }`}
                    />
                  </button>
                </div>
              </Scrub>
            );
          })}

          <div className="mt-6 flex justify-center gap-4">
            <button
              type="button"
              onClick={() => setShowAllMobile(!showAllMobile)}
              className="ts-icon-btn ts-surface min-h-[44px] w-full cursor-pointer px-5 py-3 text-sm font-semibold text-ink hover:text-ink"
            >
              {showAllMobile ? 'See fewer steps' : 'See more steps'}
            </button>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default memo(Process);
