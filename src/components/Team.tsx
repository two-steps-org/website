import React, { useState, useRef, useEffect } from 'react';
import { m } from 'framer-motion';
import { Linkedin, Instagram, ChevronLeft, ChevronRight } from 'lucide-react';
import Section from './common/Section';
import ResponsiveImage from './common/ResponsiveImage';
import { hapticFeedback } from '../utils/mobile/hapticFeedback';
import clsx from 'clsx';
import SplitText from './common/SplitText';
import { pop, reveal, scaleItem, settle } from '../utils/motion';

const team = [
  {
    name: 'Jonathan Insell',
    role: 'CEO & Founder',
    image: '/Yoni.jpg',
    social: {
      linkedin: 'https://www.linkedin.com/in/jonathan-charles-insell/',
      instagram: 'https://www.instagram.com/twostepsai/',
    },
  },
  {
    name: 'Shay Bushary',
    role: 'Head Developer',
    image: '/Shay.jpeg',
    social: {
      linkedin: 'https://www.linkedin.com/in/shaybushary/',
      instagram: 'https://www.instagram.com/twostepsai/',
    },
  },
  {
    name: 'Ziv Edri',
    role: 'CFO',
    image: '/Ziv.jpeg',
    social: {
      linkedin: 'https://www.linkedin.com/in/ziv-edri/',
      instagram: 'https://www.instagram.com/twostepsai/',
    },
  },
  {
    name: 'Tal Sumroy',
    role: 'Head of Marketing',
    image: '/Tal.jpeg',
    social: {
      linkedin: 'https://www.linkedin.com/in/tal-sumroy/',
      instagram: 'https://www.instagram.com/twostepsai/',
    },
  },
];

const extendedTeam = ['before', 'main', 'after'].flatMap((copy) =>
  team.map((member) => ({ member, copy })),
);

const Team: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollRafRef = useRef<number | null>(null);
  
  const totalItems = team.length;

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

      // Update active dot based on relative position
      const relativeScroll = normalizedScrollLeft % singleSetWidth;
      const itemWidth = singleSetWidth / totalItems;
      const nextIndex = Math.round(relativeScroll / itemWidth) % totalItems;
      setActiveIndex((prev) => (prev === nextIndex ? prev : nextIndex));
    });
  };

  return (
    <Section className="relative py-6 md:py-16 lg:py-24" id="team">
      <div className="relative text-center mb-8 md:mb-16">
        <m.p {...reveal()} className="ts-eyebrow mb-4">
          The Team
        </m.p>
        <SplitText as="h2" delay={0.1} className="ts-h2 text-ink mb-6" text="We Are Ready To Provide Solutions" />
      </div>

      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {team.map((member, index) => (
          <m.div
            key={member.name}
            {...scaleItem(index)}
            className="group relative"
          >
            <div className="relative ts-card backdrop-blur-xl rounded-2xl overflow-hidden transition-transform duration-300 hover:-translate-y-1">
              <div className="relative h-[350px] overflow-hidden">
                {/* The frame is clipped, so the photo settling from a zoom reads
                    as the portrait coming into focus. */}
                <m.div {...settle(index * 0.06)} className="w-full h-full">
                  <ResponsiveImage
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transition-[transform,filter] duration-700 group-hover:scale-110 brightness-90 group-hover:brightness-100 group-hover:contrast-125"
                  />
                </m.div>
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent" />
              </div>
              <div className="relative p-6 -mt-16">
                <h3 className="ts-h3 text-ink mb-2 mt-4">{member.name}</h3>
                <p
                  className={`text-muted font-medium mb-4`}
                >
                  {member.role}
                </p>
                <div className="flex space-x-3">
                  <m.a
                    {...pop(0, 0.35 + index * 0.06)}
                    href={member.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -2 }}
                    className={`p-2 rounded-xl border border-line-strong bg-ink/5 text-ink hover:bg-ink/10 transition-colors`}
                  >
                    <Linkedin className="w-5 h-5 text-ink" />
                  </m.a>
                  <m.a
                    {...pop(1, 0.35 + index * 0.06)}
                    href={member.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -2 }}
                    className={`p-2 rounded-xl border border-line-strong bg-ink/5 text-ink hover:bg-ink/10 transition-colors`}
                  >
                    <Instagram className="w-5 h-5 text-ink" />
                  </m.a>
                </div>
              </div>
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
            {extendedTeam.map(({ member, copy }) => (
              <div key={`${copy}-${member.name}`} className="snap-center shrink-0 w-[82vw]">
                <div
                  className="group relative h-full overflow-hidden rounded-3xl ts-card backdrop-blur-xl touch-manipulation"
                >
                  <div className="relative w-full aspect-[4/5] overflow-hidden">
                    <ResponsiveImage
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/30 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="ts-h3 text-ink mb-1">{member.name}</h3>
                      <p className={`text-base font-semibold text-ink mb-4`}>
                        {member.role}
                      </p>
                      <div className="flex space-x-3">
                        <m.a
                          href={member.social.linkedin}
                          whileTap={{ scale: 0.95 }}
                          onTapStart={() => hapticFeedback.selection()}
                          className={`p-2 rounded-xl border border-line-strong bg-ink/5 text-ink border border-line touch-manipulation`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Linkedin className="w-4 h-4 text-ink" />
                        </m.a>
                        <m.a
                          href={member.social.instagram}
                          whileTap={{ scale: 0.95 }}
                          onTapStart={() => hapticFeedback.selection()}
                          className={`p-2 rounded-xl border border-line-strong bg-ink/5 text-ink border border-line touch-manipulation`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Instagram className="w-4 h-4 text-ink" />
                        </m.a>
                      </div>
                    </div>
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
                {team.map((member, i) => (
                  <div
                    key={member.name}
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

export default Team;
