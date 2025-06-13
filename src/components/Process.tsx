import React, { useRef, memo } from 'react';
import { motion, useInView } from 'framer-motion';
import clsx from 'clsx';
import { Search, Lightbulb, Code2, Rocket, RefreshCw } from 'lucide-react';
import Section from './common/Section';
import AnimatedGradientText from './common/AnimatedGradientText';
import BackgroundGradient from './common/BackgroundGradient';
import { useBreakpoint } from '../utils/responsive';

// Predefined step data
const steps = [
  {
    step: 'Step 01',
    title: 'Discovery Call',
    description:
      "We begin with a one-on-one consultation call to understand your vision, challenges, and goals. This call helps us explore your unique needs and identify areas where AI can deliver the most impact. It's the foundation for building a solution tailored to your business.",
    gradient: 'from-blue-400 via-blue-500 to-indigo-500',
    icon: Search
  },
  {
    step: 'Step 02',
    title: 'Tailored Solution Design',
    description:
      "Our expert team designs a personalized AI solution. From defining the AI's personality to building its knowledge base and mapping out workflows, we ensure every detail aligns seamlessly with your operations and business goals.",
    gradient: 'from-purple-400 via-purple-500 to-pink-500',
    icon: Lightbulb
  },
  {
    step: 'Step 03',
    title: 'Development & Integration',
    description:
      'Using the latest AI technology, we bring your solution to life. Our seamless integration process ensures your AI tools connect effortlessly with your existing platforms, providing a smooth and efficient experience for your team and customers.',
    gradient: 'from-amber-400 via-amber-500 to-orange-500',
    icon: Code2
  },
  {
    step: 'Step 04',
    title: 'Deployment & Training',
    description:
      'Your AI solution is launched! We embed it into your business operations and provide comprehensive training for your team, equipping them to maximize its potential and achieve immediate results.',
    gradient: 'from-green-400 via-green-500 to-emerald-500',
    icon: Rocket
  },
  {
    step: 'Step 05',
    title: 'Continuous Optimization',
    description:
      "Our commitment doesn't end with deployment. We continuously monitor performance, refine capabilities, and scale your solution as your business grows. This ensures you remain ahead in the fast-paced AI landscape.",
    gradient: 'from-blue-400 via-blue-500 to-cyan-500',
    icon: RefreshCw
  }
];

/**
 * Process displays a series of steps describing the workflow,
 * including a timeline (on desktop) and animated icons/cards.
 */
const BaseProcess: React.FC = () => {
  const breakpoint = useBreakpoint();
  const isMobile = ['xs', 'sm'].includes(breakpoint);
  const isTablet = breakpoint === 'md';
  const processRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(processRef, { once: true, amount: 0.1 });

  return (
    <BackgroundGradient>
      <Section id="process" className="py-12 md:py-16 lg:py-20">
        <div className="relative" ref={processRef}>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="text-center mb-10 md:mb-12 lg:mb-16"
          >
            <span className="text-blue-400 text-sm font-semibold tracking-wider uppercase mb-4 block">
              OUR PROCESS
            </span>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              <AnimatedGradientText gradient="from-white via-gray-300 to-white">
                How We Transform Your Business
              </AnimatedGradientText>
            </h2>
          </motion.div>

          {/* Main Content */}
          <div className="relative max-w-6xl mx-auto">
            {/* Vertical timeline on larger screens */}
            {!isMobile && (
              <div className="absolute left-[100px] sm:left-1/2 -translate-x-[1px] w-[3px] h-full">
                <motion.div
                  className="absolute inset-0 bg-gradient-to-b from-blue-500/20 via-purple-500/20 to-blue-500/20"
                  initial={{ scaleY: 0 }}
                  animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
                  transition={{ duration: 1.2, ease: 'anticipate' }}
                />
                <motion.div
                  className="absolute inset-0 overflow-hidden"
                  initial={{ opacity: 0 }}
                  animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <motion.div
                    className="absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-blue-500/40 to-transparent"
                    animate={{
                      y: isInView ? ['-25%', '125%'] : '0%'
                    }}
                    transition={{
                      duration: 1.8,
                      ease: 'linear',
                      repeat: Infinity,
                      repeatDelay: 0
                    }}
                  />
                </motion.div>
              </div>
            )}

            {/* Steps */}
            <div
              className={clsx(
                'space-y-6 md:space-y-10 lg:space-y-12',
                isMobile && 'px-4'
              )}
            >
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{
                    duration: 0.5,
                    delay: isInView ? index * 0.15 : 0,
                    type: 'spring',
                    stiffness: 100
                  }}
                  className={clsx(
                    'relative flex',
                    isMobile
                      ? 'flex-col items-center text-center'
                      : index % 2 === 0
                      ? 'items-center justify-start'
                      : 'items-center justify-end'
                  )}
                >
                  {/* Content Card */}
                  <div
                    className={clsx(
                      isMobile
                        ? 'w-[90%]'
                        : isTablet
                        ? 'w-[85%]'
                        : `w-[calc(50%-2rem)] ${
                            index % 2 === 0 ? 'pr-8' : 'pl-8'
                          }`
                    )}
                  >
                    <motion.div
                      className="relative group"
                      whileHover={{
                        scale: 1.025,
                        transition: { duration: 0.2 }
                      }}
                    >
                      <div className="relative z-10 bg-gray-900/60 backdrop-blur-xl p-5 md:p-6 rounded-2xl border border-gray-800/50 hover:border-gray-700/50 transition-all duration-300 shadow-lg hover:shadow-xl">
                        {/* Step Number & Title */}
                        <div className="flex items-center gap-4 mb-3">
                          <motion.div
                            className={clsx(
                              'px-3 py-1 rounded-full bg-gradient-to-r shadow-lg relative',
                              step.gradient
                            )}
                            whileHover={{
                              scale: 1.1,
                              rotate: [0, -5, 5, 0],
                              transition: {
                                duration: 0.3,
                                type: 'spring'
                              }
                            }}
                          >
                            <span className="text-sm font-bold text-white tracking-wide">
                              {step.step}
                            </span>
                          </motion.div>
                          <h3
                            className={clsx(
                              'text-xl font-bold bg-gradient-to-r bg-clip-text text-transparent',
                              step.gradient
                            )}
                          >
                            {step.title}
                          </h3>
                        </div>
                        <p className="text-gray-400 leading-relaxed text-[14px]">
                          {step.description}
                        </p>
                      </div>

                      {/* Card Glow */}
                      <motion.div
                        className={clsx(
                          'absolute -inset-2 bg-gradient-to-r rounded-3xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-300 -z-10',
                          step.gradient
                        )}
                        initial={{ scale: 0.9 }}
                        whileHover={{
                          scale: 1.1,
                          opacity: 0.15,
                          transition: { duration: 0.3 }
                        }}
                      />
                    </motion.div>
                  </div>

                  {/* Icon */}
                  <div
                    className={clsx(
                      isMobile
                        ? '-order-1 mb-4'
                        : 'absolute left-[100px] sm:left-1/2 -translate-x-1/2'
                    )}
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
                      transition={{
                        type: 'spring',
                        stiffness: 260,
                        damping: 20,
                        delay: 0.2
                      }}
                      className={clsx(
                        'relative w-14 h-14 rounded-2xl bg-gradient-to-r p-[1px] group',
                        step.gradient
                      )}
                    >
                      <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center relative overflow-hidden">
                        <step.icon className="w-7 h-7 text-white relative z-10" />
                        {/* Icon Shine Effect */}
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '100%' }}
                          transition={{ duration: 0.6, ease: 'easeInOut' }}
                        />
                      </div>
                      {/* Icon Glow Effect */}
                      <motion.div
                        className={clsx(
                          'absolute -inset-2 bg-gradient-to-r rounded-2xl opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300 -z-10',
                          step.gradient
                        )}
                        initial={{ scale: 0.8 }}
                        whileHover={{ scale: 1.2 }}
                      />
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </Section>
    </BackgroundGradient>
  );
};

export default memo(BaseProcess);
