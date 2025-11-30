import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Target,
  Puzzle,
  Brain,
  Rocket,
  ShieldCheck,
  HeartHandshake,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Section from './common/Section';

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity;

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => (prev + newDirection + features.length) % features.length);
  };

  return (
    <Section id="why-us" className="py-14 sm:py-18 md:py-22 lg:py-24 relative">
      {/* Heading */}
      <div className="relative text-center mb-12 md:mb-16">
        <div className="inline-flex mb-4 px-4 sm:px-5 py-2.5 bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent rounded-full backdrop-blur-sm border border-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:border-blue-500/20 hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] transition-all duration-300 mx-auto lg:mx-0">
          <span className="text-blue-400 text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2">
            <Sparkles className="w-4 h-4 animate-[pulse_2s_ease-in-out_infinite]" />
            UNIQUE VALUES
          </span>
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-2xl md:text-4xl md:text-5xl font-bold"
        >
          <span className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            Why Choose Us?
          </span>
        </motion.h2>
      </div>

      {/* Features grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 lg:gap-7">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative"
          >
            <div className="relative overflow-hidden rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 p-5 md:p-6 hover:border-blue-500/30 transition-all duration-300">
              {/* Header */}
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

              {/* Description */}
              <p className="text-gray-400 text-sm md:text-base leading-relaxed">
                {feature.description}
              </p>
            </div>

            {/* Hover/Active Effect */}
            <div
              className={`absolute -inset-2 bg-gradient-to-r ${feature.gradient} rounded-3xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 -z-10`}
            />
          </motion.div>
        ))}
      </div>

      {/* Mobile carousel */}
      <div className="block md:hidden relative min-h-[320px] overflow-visible px-1 sm:px-2">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(_, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute inset-0 px-1"
          >
            <motion.div
              whileTap={{ scale: 0.98 }}
              className="relative h-[80%] min-h-[240px] overflow-hidden rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 p-5 sm:p-6 group hover:border-blue-500/30 transition-all duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-r ${features[currentIndex].gradient} p-[1px] flex-shrink-0`}
                >
                  <div className="w-full h-full rounded-xl bg-gray-900 flex items-center justify-center">
                    {React.createElement(features[currentIndex].icon, {
                      className: 'w-5 h-5 text-white',
                    })}
                  </div>
                </div>
                <h3
                  className={`text-lg sm:text-xl font-bold bg-gradient-to-r ${features[currentIndex].gradient} bg-clip-text text-transparent`}
                >
                  {features[currentIndex].title}
                </h3>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                {features[currentIndex].description}
              </p>

              <div
                className={`absolute -inset-2 bg-gradient-to-r ${features[currentIndex].gradient} rounded-3xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 -z-10`}
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="absolute inset-x-0 bottom-0 flex justify-center items-center z-10">
          <div className="flex items-center gap-3 mb-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => paginate(-1)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </motion.button>

            <div className="flex space-x-2">
              {features.map((feature, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > currentIndex ? 1 : -1);
                    setCurrentIndex(idx);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? `bg-gradient-to-r ${feature.gradient}` : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => paginate(1)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </motion.button>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default WhyUs;
