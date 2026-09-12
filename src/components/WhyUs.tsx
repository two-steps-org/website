import React, { useState, useRef, useEffect } from 'react';
import { m } from 'framer-motion';
import {
  Target,
  Puzzle,
  Brain,
  Rocket,
  ShieldCheck,
  HeartHandshake,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Section from './common/Section';
import { hapticFeedback } from '../utils/mobile/hapticFeedback';
import clsx from 'clsx';
import SplitText from './common/SplitText';
import { pop, reveal, scaleIn, STAGGER } from '../utils/motion';

const features = [
  {
    icon: Target,
    title: 'Built for Your Business',
    description:
      'Our AI solutions are custom-built to fit your goals, industry, and challenges—because your business deserves more than one-size-fits-all.',
  },
  {
    icon: Puzzle,
    title: 'Effortless Integration',
    description:
      'Seamlessly connect our AI solutions with your existing tools and workflows, ensuring zero downtime and immediate results.',
  },
  {
    icon: Brain,
    title: 'Intelligence You Can Trust',
    description:
      'Our AI agents are designed with precision, delivering reliable, consistent results that you can count on.',
  },
  {
    icon: Rocket,
    title: 'Evolving with Your Needs',
    description:
      "Our solutions grow with you, adapting to your business's evolution so you're always ready for what's next.",
  },
  {
    icon: ShieldCheck,
    title: 'Security at the Core',
    description:
      'Every AI solution we build is designed with advanced data protection, keeping your operations secure at every step.',
  },
  {
    icon: HeartHandshake,
    title: 'Expertise You Can Rely On',
    description:
      'Our team of specialists works closely with you, from concept to delivery, to ensure your AI vision becomes a reality.',
  },
];

const extendedFeatures = ['before', 'main', 'after'].flatMap((copy) =>
  features.map((feature) => ({ feature, copy })),
);

const WhyUs: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollRafRef = useRef<number | null>(null);
  
  const totalItems = features.length;

  useEffect(() => {
    if (scrollRef.current) {
      const { scrollWidth } = scrollRef.current;
      scrollRef.current.scrollLeft = scrollWidth / 3;
    }
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      // Scroll by roughly one card width + gap
      const scrollAmount = clientWidth - 40;
      const targetScroll = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      
      scrollRef.current.scrollTo({ left: targetScroll, behavior: 'smooth' });
      hapticFeedback.selection();
    }
  };

  useEffect(() => {
    return () => {
      if (scrollRafRef.current !== null) {
        window.cancelAnimationFrame(scrollRafRef.current);
      }
    };
  }, []);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    if (scrollRafRef.current !== null) return;

    scrollRafRef.current = window.requestAnimationFrame(() => {
      scrollRafRef.current = null;
      const el = scrollRef.current;
      if (!el) return;

      const { scrollLeft, scrollWidth, clientWidth } = el;
      const singleSetWidth = scrollWidth / 3;
      if (!singleSetWidth) return;

      // Seamless jump logic - jump when nearing edges to avoid "hitting a wall"
      let normalizedScrollLeft = scrollLeft;
      if (scrollLeft < 20) {
        normalizedScrollLeft = scrollLeft + singleSetWidth;
        el.scrollLeft = normalizedScrollLeft;
      } else if (scrollLeft > scrollWidth - clientWidth - 20) {
        normalizedScrollLeft = scrollLeft - singleSetWidth;
        el.scrollLeft = normalizedScrollLeft;
      }

      const relativeScroll = normalizedScrollLeft % singleSetWidth;
      const itemWidth = singleSetWidth / totalItems;
      const nextIndex = Math.round(relativeScroll / itemWidth) % totalItems;
      setActiveIndex((prev) => (prev === nextIndex ? prev : nextIndex));
    });
  };

  return (
    <Section className="py-6 md:py-16 lg:py-24 relative" id="why-us">
      <div className="relative text-center mb-8 md:mb-16">
        <m.p {...reveal()} className="ts-eyebrow mb-4">
          WHY US?
        </m.p>
        <SplitText as="h2" delay={0.1} className="ts-h2 text-ink" text="What Sets Us Apart" />
      </div>

      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-7">
        {features.map((feature, index) => (
          <m.div
            key={feature.title}
            // Diagonal sweep: delay grows with row + column, so the grid fills
            // from the top-left corner to the bottom-right.
            {...scaleIn((Math.floor(index / 3) + (index % 3)) * STAGGER)}
            className="group relative"
          >
            <div className="relative overflow-hidden rounded-2xl ts-card backdrop-blur-xl p-5 md:p-6 transition-[border-color,transform] duration-300 hover:border-line-strong hover:-translate-y-1">
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <m.div
                  {...pop(index, 0.25)}
                  className="w-10 h-10 md:w-12 md:h-12 rounded-xl border border-line-strong shrink-0 group-hover:scale-110 transition-transform duration-300"
                >
                  <div className="w-full h-full rounded-xl bg-surface flex items-center justify-center">
                    <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-ink" />
                  </div>
                </m.div>
                <h3
                  className="ts-h3 text-ink"
                >
                  {feature.title}
                </h3>
              </div>
              <p className="text-muted text-sm md:text-base leading-relaxed">
                {feature.description}
              </p>
            </div>
          </m.div>
        ))}
      </div>

      <m.div {...reveal(0.12)} className="block md:hidden">
        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-proximity gap-4 pb-4 scrollbar-hide"
            style={{ paddingLeft: '9vw', paddingRight: '9vw', WebkitOverflowScrolling: 'touch', touchAction: 'pan-x pan-y' }}
          >
            {extendedFeatures.map(({ feature, copy }) => (
              <div key={`${copy}-${feature.title}`} className="snap-center shrink-0 w-[82vw]">
                <div
                  className="relative h-full min-h-[280px] flex flex-col overflow-hidden rounded-3xl ts-card backdrop-blur-xl p-6 group touch-manipulation"
                >
                  <div className={`absolute inset-0 hidden`} />
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-2xl border border-line-strong shadow-lg shrink-0`}>
                        <div className="w-full h-full rounded-2xl bg-bg flex items-center justify-center">
                          <feature.icon className="w-5 h-5 text-ink" />
                        </div>
                      </div>
                      <h3 className="ts-h3 text-ink">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-muted text-base leading-relaxed flex-grow">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center mt-2 w-full">
            <div className="flex items-center gap-6">
              <m.button
                whileTap={{ scale: 0.9 }}
                onClick={() => scroll('left')}
                className="p-3 rounded-2xl ts-card backdrop-blur-xl text-muted hover:text-ink transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </m.button>
              <div className="flex gap-2">
                {features.map((feature, i) => (
                  <div
                    key={feature.title}
                    className={clsx(
                      "w-1.5 h-1.5 rounded-full transition-[width,background-color] duration-300",
                      activeIndex === i ? "bg-ink w-3" : "bg-line-strong"
                    )}
                  />
                ))}
              </div>
              <m.button
                whileTap={{ scale: 0.9 }}
                onClick={() => scroll('right')}
                className="p-3 rounded-2xl ts-card backdrop-blur-xl text-muted hover:text-ink transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </m.button>
            </div>
          </div>
        </div>
      </m.div>
    </Section>
  );
};

export default WhyUs;
