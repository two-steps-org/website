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

const features = [
  {
    icon: Target,
    title: 'Built for Your Business',
    description:
      'Our AI solutions are custom-built to fit your goals, industry, and challenges—because your business deserves more than one-size-fits-all.',
    gradient: 'from-blue-500 to-indigo-500',
  },
  {
    icon: Puzzle,
    title: 'Effortless Integration',
    description:
      'Seamlessly connect our AI solutions with your existing tools and workflows, ensuring zero downtime and immediate results.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Brain,
    title: 'Intelligence You Can Trust',
    description:
      'Our AI agents are designed with precision, delivering reliable, consistent results that you can count on.',
    gradient: 'from-amber-500 to-orange-500',
  },
  {
    icon: Rocket,
    title: 'Evolving with Your Needs',
    description:
      "Our solutions grow with you, adapting to your business's evolution so you're always ready for what's next.",
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: ShieldCheck,
    title: 'Security at the Core',
    description:
      'Every AI solution we build is designed with advanced data protection, keeping your operations secure at every step.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: HeartHandshake,
    title: 'Expertise You Can Rely On',
    description:
      'Our team of specialists works closely with you, from concept to delivery, to ensure your AI vision becomes a reality.',
    gradient: 'from-purple-500 to-indigo-500',
  },
];

const WhyUs: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const totalItems = features.length;
  const extendedFeatures = [...features, ...features, ...features];

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

  const handleScroll = () => {
    if (scrollRef.current) {
      // Batch DOM reads to prevent forced reflows
      requestAnimationFrame(() => {
        if (!scrollRef.current) return;

        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const singleSetWidth = scrollWidth / 3;

        // Batch DOM writes after all reads
        requestAnimationFrame(() => {
          if (!scrollRef.current) return;

          // Seamless jump logic - jump when nearing edges to avoid "hitting a wall"
          if (scrollLeft < 20) {
            scrollRef.current.scrollLeft = scrollLeft + singleSetWidth;
          } else if (scrollLeft > scrollWidth - clientWidth - 20) {
            scrollRef.current.scrollLeft = scrollLeft - singleSetWidth;
          }

          const relativeScroll = (scrollLeft % singleSetWidth);
          const itemWidth = singleSetWidth / totalItems;
          const index = Math.round(relativeScroll / itemWidth);
          setActiveIndex(index % totalItems);
        });
      });
    }
  };

  return (
    <Section className="py-6 sm:py-12 md:py-16 lg:py-24 relative" id="why-us">
      <div className="relative text-center mb-8 md:mb-16">
        <div className="inline-flex mb-4 px-4 sm:px-5 py-2.5 bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent rounded-full backdrop-blur-sm border border-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:border-blue-500/20 hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] transition-all duration-300 mx-auto">
          <span className="text-blue-400 text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2">
            <Target className="w-4 h-4 animate-[pulse_2s_ease-in-out_infinite]" />
            WHY US?
          </span>
        </div>
        <m.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold"
        >
          <span className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            What Sets Us Apart
          </span>
        </m.h2>
      </div>

      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-7">
        {features.map((feature, index) => (
          <m.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative"
          >
            <div className="relative overflow-hidden rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 p-5 md:p-6 hover:border-blue-500/30 transition-all duration-300">
              <div className="flex items-center gap-3 md:gap-4 mb-4 md:mb-6">
                <div
                  className={`w-10 h-10 md:w-12 md:h-12 rounded-xl bg-gradient-to-r ${feature.gradient} p-[1px] shrink-0 group-hover:scale-110 transition-transform duration-300`}
                >
                  <div className="w-full h-full rounded-xl bg-gray-900 flex items-center justify-center">
                    <feature.icon className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                </div>
                <h3
                  className={`text-lg sm:text-xl font-bold bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent`}
                >
                  {feature.title}
                </h3>
              </div>
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                {feature.description}
              </p>
            </div>
            <div
              className={`absolute -inset-2 bg-gradient-to-r ${feature.gradient} rounded-3xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 -z-10`}
            />
          </m.div>
        ))}
      </div>

      <div className="block md:hidden">
        <div className="relative">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex overflow-x-auto snap-x snap-proximity gap-4 pb-4 px-10 scrollbar-hide"
            style={{ WebkitOverflowScrolling: 'touch', touchAction: 'pan-x pan-y' }}
          >
            {extendedFeatures.map((feature, index) => (
              <div key={`${feature.title}-${index}`} className="snap-center shrink-0 w-[280px] xs:w-[300px]">
                <div
                  className="relative h-full min-h-[280px] flex flex-col overflow-hidden rounded-3xl bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 p-6 group transition-all duration-300 touch-manipulation"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-[0.03]`} />
                  <div className="relative z-10 flex flex-col h-full">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${feature.gradient} p-[1px] shadow-lg shadow-blue-500/10 shrink-0`}>
                        <div className="w-full h-full rounded-2xl bg-gray-950 flex items-center justify-center">
                          <feature.icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                      <h3 className={`text-xl font-bold bg-gradient-to-r ${feature.gradient} bg-clip-text text-transparent leading-tight`}>
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-gray-400 text-base leading-relaxed flex-grow">
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
                className="p-3 rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 text-white/50 hover:text-white transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </m.button>
              <div className="flex gap-2">
                {features.map((_, i) => (
                  <div
                    key={i}
                    className={clsx(
                      "w-1.5 h-1.5 rounded-full transition-all duration-300",
                      activeIndex === i ? "bg-blue-500 w-3" : "bg-gray-700"
                    )}
                  />
                ))}
              </div>
              <m.button
                whileTap={{ scale: 0.9 }}
                onClick={() => scroll('right')}
                className="p-3 rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 text-white/50 hover:text-white transition-colors"
                aria-label="Scroll right"
              >
                <ChevronRight className="w-5 h-5" />
              </m.button>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default WhyUs;
