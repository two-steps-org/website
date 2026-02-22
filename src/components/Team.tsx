import React, { useState, useRef, useEffect } from 'react';
import { m } from 'framer-motion';
import { Linkedin, Instagram, Users, ChevronLeft, ChevronRight } from 'lucide-react';
import Section from './common/Section';
import ResponsiveImage from './common/ResponsiveImage';
import { hapticFeedback } from '../utils/mobile/hapticFeedback';
import clsx from 'clsx';

const team = [
  {
    name: 'Jonathan Insell',
    role: 'CEO & Founder',
    image: '/Yoni.jpg',
    gradient: 'from-blue-500 to-indigo-500',
    social: {
      linkedin: 'https://www.linkedin.com/in/jonathan-charles-insell/',
      instagram: 'https://www.instagram.com/twostepsai/',
    },
  },
  {
    name: 'Shay Bushary',
    role: 'Head Developer',
    image: '/Shay.jpeg',
    gradient: 'from-purple-500 to-pink-500',
    social: {
      linkedin: 'https://www.linkedin.com/in/shaybushary/',
      instagram: 'https://www.instagram.com/twostepsai/',
    },
  },
  {
    name: 'Ziv Edri',
    role: 'CFO',
    image: '/Ziv.jpeg',
    gradient: 'from-amber-500 to-orange-500',
    social: {
      linkedin: 'https://www.linkedin.com/in/ziv-edri/',
      instagram: 'https://www.instagram.com/twostepsai/',
    },
  },
  {
    name: 'Tal Sumroy',
    role: 'Head of Marketing',
    image: '/Tal.jpeg',
    gradient: 'from-green-500 to-emerald-500',
    social: {
      linkedin: 'https://www.linkedin.com/in/tal-sumroy/',
      instagram: 'https://www.instagram.com/twostepsai/',
    },
  },
];

const Team: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const totalItems = team.length;
  const extendedTeam = [...team, ...team, ...team];

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

          // Update active dot based on relative position
          const relativeScroll = (scrollLeft % singleSetWidth);
          const itemWidth = singleSetWidth / totalItems;
          const index = Math.round(relativeScroll / itemWidth);
          setActiveIndex(index % totalItems);
        });
      });
    }
  };

  return (
    <Section className="relative py-6 sm:py-12 md:py-16 lg:py-24" id="team">
      <div className="relative text-center mb-8 sm:mb-16">
        <div className="inline-flex mb-4 px-4 sm:px-5 py-2.5 bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent rounded-full backdrop-blur-sm border border-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:border-blue-500/20 hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] transition-all duration-300 mx-auto">
          <span className="text-blue-400 text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2">
            <Users className="w-4 h-4 animate-[pulse_2s_ease-in-out_infinite]" />
            The Team
          </span>
        </div>
        <m.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
        >
          <span className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            We Are Ready To Provide Solutions
          </span>
        </m.h2>
      </div>

      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {team.map((member, index) => (
          <m.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="group relative"
          >
            <div className="relative bg-gray-900/50 backdrop-blur-xl rounded-2xl overflow-hidden">
              <div className="relative h-[350px] overflow-hidden">
                <ResponsiveImage
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 brightness-90 group-hover:brightness-100 group-hover:contrast-125"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
              </div>
              <div className="relative p-6 -mt-16">
                <h3 className="text-2xl font-bold text-white mb-2 mt-4">{member.name}</h3>
                <p
                  className={`text-transparent bg-clip-text bg-gradient-to-r ${member.gradient} font-medium mb-4`}
                >
                  {member.role}
                </p>
                <div className="flex space-x-3">
                  <m.a
                    href={member.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -2 }}
                    className={`p-2 rounded-xl bg-gradient-to-r ${member.gradient} bg-opacity-50 hover:bg-opacity-75 transition-all`}
                  >
                    <Linkedin className="w-5 h-5 text-white" />
                  </m.a>
                  <m.a
                    href={member.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -2 }}
                    className={`p-2 rounded-xl bg-gradient-to-r ${member.gradient} bg-opacity-50 hover:bg-opacity-75 transition-all`}
                  >
                    <Instagram className="w-5 h-5 text-white" />
                  </m.a>
                </div>
              </div>
            </div>
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
            {extendedTeam.map((member, index) => (
              <div key={`${member.name}-${index}`} className="snap-center shrink-0 w-[280px] xs:w-[300px]">
                <div
                  className="group relative h-full overflow-hidden rounded-3xl bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 transition-all duration-300 touch-manipulation"
                >
                  <div className="relative w-full aspect-[4/5] overflow-hidden">
                    <ResponsiveImage
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/90 via-gray-900/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-2xl font-bold text-white mb-1">{member.name}</h3>
                      <p className={`text-base font-semibold bg-gradient-to-r ${member.gradient} bg-clip-text text-transparent mb-4`}>
                        {member.role}
                      </p>
                      <div className="flex space-x-3">
                        <m.a
                          href={member.social.linkedin}
                          whileTap={{ scale: 0.95 }}
                          onTapStart={() => hapticFeedback.selection()}
                          className={`p-2 rounded-xl bg-gradient-to-r ${member.gradient} bg-opacity-50 border border-white/10 touch-manipulation`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Linkedin className="w-4 h-4 text-white" />
                        </m.a>
                        <m.a
                          href={member.social.instagram}
                          whileTap={{ scale: 0.95 }}
                          onTapStart={() => hapticFeedback.selection()}
                          className={`p-2 rounded-xl bg-gradient-to-r ${member.gradient} bg-opacity-50 border border-white/10 touch-manipulation`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Instagram className="w-4 h-4 text-white" />
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
                className="p-3 rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 text-white/50 hover:text-white transition-colors"
                aria-label="Scroll left"
              >
                <ChevronLeft className="w-5 h-5" />
              </m.button>
              <div className="flex gap-2">
                {team.map((_, i) => (
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

export default Team;