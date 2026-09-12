'use client';

import React, { memo, useRef, useState } from 'react';
import { m, useScroll, useTransform } from 'framer-motion';
import clsx from 'clsx';
import { Search, Lightbulb, Code2, Rocket, RefreshCw, ChevronDown } from 'lucide-react';
import Section from './common/Section';
import SplitText from './common/SplitText';
import { pop, reveal, revealItem, slideItem } from '../utils/motion';

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

const Process: React.FC = () => {
  // processRef still drives the timeline's scroll progress below.
  const processRef = useRef<HTMLElement>(null);
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const [showAllMobile, setShowAllMobile] = useState(false);
  const toggleStep = (title: string) => {
    setExpandedStep(expandedStep === title ? null : title);
  };

  // Track scroll progress through the entire section container
  const { scrollYProgress } = useScroll({
    target: processRef,
    offset: ['start center', 'end center'],
  });

  const currentY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <Section className="py-6 md:py-16 lg:py-24" id="process" ref={processRef}>
      <div className="relative">
        {/* Header */}
        <m.div
          {...reveal()}
          className="text-center mb-8 lg:mb-16"
        >
          <p className="ts-eyebrow mb-4">OUR PROCESS</p>
          <SplitText as="h2" delay={0.1} className="ts-h2 text-ink mb-6" text="How We Transform Your Business" />
        </m.div>

        {/* Desktop/Tablet View */}
        <div className="hidden lg:block relative max-w-6xl mx-auto">
          {/* Vertical timeline - Single Unified Element */}
          <div className="absolute left-1/2 -translate-x-[1.5px] w-[3px] h-full bg-ink/10">
            <m.div
              className="absolute top-0 left-0 w-full bg-ink origin-top shadow-[0_0_12px_rgba(59,130,246,0.6)]"
              style={{ height: currentY }}
            />
          </div>

          {/* Steps */}
          <div className="space-y-12">
            {steps.map((step, index) => (
              <m.div
                key={step.title}
                {...slideItem(index % 2 === 0 ? 'left' : 'right', 0)}
                className={clsx(
                  'relative flex',
                  index % 2 === 0 ? 'items-center justify-start' : 'items-center justify-end',
                )}
              >
                {/* Card */}
                <m.div 
                  className={clsx('w-[calc(50%-2rem)]', index % 2 === 0 ? 'pr-8' : 'pl-8')}
                  whileHover={{ 
                    scale: 1.05,
                    rotateY: index % 2 === 0 ? -3 : 3,
                    z: 50,
                  }}
                  transition={{ duration: 0.3 }}
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="relative ts-card backdrop-blur-xl p-6 rounded-2xl border border-line shadow-lg hover:shadow-xl transition-shadow">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="px-3 py-1 rounded-full bg-accent">
                        <span className="text-sm font-semibold text-accent-fg">{step.step}</span>
                      </div>
                      <h3
                        className="ts-h3 text-ink"
                      >
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-muted leading-relaxed text-sm">{step.fullDescription}</p>
                  </div>
                </m.div>

                {/* Icon Hub */}
                <div className="absolute left-1/2 -translate-x-1/2">
                  <m.div
                    {...pop(0, 0.25)}
                    className="w-14 h-14 rounded-2xl border border-line-strong"
                  >
                    <div className="w-full h-full rounded-2xl bg-surface flex items-center justify-center">
                      <step.icon className="w-7 h-7 text-ink" />
                    </div>
                  </m.div>
                </div>
              </m.div>
            ))}
          </div>
        </div>

        {/* Mobile View */}
        <div className="block lg:hidden relative space-y-10">
          {steps.map((step, index) => {
            if (index >= 2 && !showAllMobile) return null;
            return (
              <m.div
                key={step.title}
                {...revealItem(index)}
                className="relative"
              >
                <m.div
                  className="relative rounded-2xl ts-card backdrop-blur-xl p-6 mt-4 touch-manipulation"
                >
                  <div
                    className="mb-2 w-fit text-[10px] font-semibold uppercase tracking-[0.08em] bg-accent text-accent-fg px-2.5 py-1 rounded-full"
                  >
                    {step.step}
                  </div>
                  <h3
                    className="ts-h3 mb-3 text-ink"
                  >
                    {step.title}
                  </h3>
                  <p className="text-muted text-base leading-relaxed">
                    {expandedStep === step.title ? step.fullDescription : step.shortDescription}
                  </p>
                  <button
                    type="button"
                    onClick={() => toggleStep(step.title)}
                    aria-expanded={expandedStep === step.title}
                    className="group/see mt-5 flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-line bg-ink/5 py-3 text-sm font-medium text-ink transition-colors duration-300 hover:bg-ink/10 active:bg-ink/15"
                  >
                    <span>{expandedStep === step.title ? 'See Less' : 'See More'}</span>
                    <ChevronDown
                      className={`h-4 w-4 text-ink transition-transform duration-300 ${
                        expandedStep === step.title ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                </m.div>
              </m.div>
            );
          })}
          
          <div className="flex justify-center gap-4 mt-6">
              <button
                onClick={() => setShowAllMobile(!showAllMobile)}
                className="rounded-xl w-full border bg-surface border-line hover:border-line-strong px-5 py-3 text-sm font-semibold text-ink transition-colors duration-300 hover:text-ink min-h-[44px]"
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
