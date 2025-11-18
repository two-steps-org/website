'use client';

import React, { useRef, memo, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import clsx from 'clsx';
import { Search, Lightbulb, Code2, Rocket, RefreshCw, ChevronDown, Sparkles } from 'lucide-react';
import Section from './common/Section';
import AnimatedGradientText from './common/AnimatedGradientText';

const steps = [
  {
    step: 'Step 01',
    title: 'Discovery Call',
    shortDescription: 'We begin with a consultation call to understand your vision and goals.',
    fullDescription:
      "We begin with a one-on-one consultation call to understand your vision, challenges, and goals. This call helps us explore your unique needs and identify areas where AI can deliver the most impact. It's the foundation for building a solution tailored to your business.",
    gradient: 'from-blue-400 via-blue-500 to-indigo-500',
    icon: Search,
  },
  {
    step: 'Step 02',
    title: 'Tailored Solution Design',
    shortDescription: 'Our team designs a personalized AI solution aligned with your operations.',
    fullDescription:
      "Our expert team designs a personalized AI solution. From defining the AI's personality to building its knowledge base and mapping out workflows, we ensure every detail aligns seamlessly with your operations and business goals.",
    gradient: 'from-purple-400 via-purple-500 to-pink-500',
    icon: Lightbulb,
  },
  {
    step: 'Step 03',
    title: 'Development & Integration',
    shortDescription: 'We develop and integrate your AI solution with your existing platforms.',
    fullDescription:
      'Using the latest AI technology, we bring your solution to life. Our seamless integration process ensures your AI tools connect effortlessly with your existing platforms, providing a smooth and efficient experience for your team and customers.',
    gradient: 'from-amber-400 via-amber-500 to-orange-500',
    icon: Code2,
  },
  {
    step: 'Step 04',
    title: 'Deployment & Training',
    shortDescription:
      'We launch your AI solution and provide comprehensive training for your team.',
    fullDescription:
      'Your AI solution is launched! We embed it into your business operations and provide comprehensive training for your team, equipping them to maximize its potential and achieve immediate results.',
    gradient: 'from-green-400 via-green-500 to-emerald-500',
    icon: Rocket,
  },
  {
    step: 'Step 05',
    title: 'Continuous Optimization',
    shortDescription:
      'We continuously monitor and optimize your AI solution as your business grows.',
    fullDescription:
      "Our commitment doesn't end with deployment. We continuously monitor performance, refine capabilities, and scale your solution as your business grows. This ensures you remain ahead in the fast-paced AI landscape.",
    gradient: 'from-blue-400 via-blue-500 to-cyan-500',
    icon: RefreshCw,
  },
];

const Process: React.FC = () => {
  const processRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(processRef, { once: true, amount: 0.1 });
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [showAllMobile, setShowAllMobile] = useState(false);

  return (
    <Section id="process" className="py-16 md:py-20 lg:py-24">
      <div className="relative" ref={processRef}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-12 lg:mb-16"
        >
          <div className="inline-flex mb-4 px-4 sm:px-5 py-2.5 bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent rounded-full backdrop-blur-sm border border-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:border-blue-500/20 hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] transition-all duration-300 mx-auto lg:mx-0">
            <span className="text-blue-400 text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2">
              <Sparkles className="w-4 h-4 animate-[pulse_2s_ease-in-out_infinite]" />
              OUR PROCESS
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            <AnimatedGradientText gradient="from-white via-gray-300 to-white">
              How We Transform Your Business
            </AnimatedGradientText>
          </h2>
        </motion.div>

        {/* Desktop/Tablet View */}
        <div className="hidden lg:block relative max-w-6xl mx-auto">
          {/* Vertical timeline */}
          <div className="absolute left-1/2 -translate-x-[1px] w-[3px] h-full">
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-blue-500/20 via-purple-500/20 to-blue-500/20"
              initial={{ scaleY: 0 }}
              animate={isInView ? { scaleY: 1 } : {}}
              transition={{ duration: 1.2, ease: 'anticipate' }}
            />
            <motion.div className="absolute inset-0 overflow-hidden">
              <motion.div
                className="absolute inset-x-0 h-32 bg-gradient-to-b from-transparent via-blue-500/40 to-transparent"
                animate={{ y: isInView ? ['-25%', '125%'] : '0%' }}
                transition={{
                  duration: 1.8,
                  ease: 'linear',
                  repeat: Infinity,
                }}
              />
            </motion.div>
          </div>

          {/* Steps */}
          <div className="space-y-12">
            {steps.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className={clsx(
                  'relative flex',
                  index % 2 === 0 ? 'items-center justify-start' : 'items-center justify-end',
                )}
              >
                {/* Card */}
                <div className={clsx('w-[calc(50%-2rem)]', index % 2 === 0 ? 'pr-8' : 'pl-8')}>
                  <div className="relative bg-gray-900/60 backdrop-blur-xl p-6 rounded-2xl border border-gray-800/50 shadow-lg hover:shadow-xl transition-all">
                    <div className="flex items-center gap-4 mb-4">
                      <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${step.gradient}`}>
                        <span className="text-sm font-bold text-white">{step.step}</span>
                      </div>
                      <h3
                        className={`text-xl font-bold bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent`}
                      >
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-gray-400 leading-relaxed text-sm">{step.fullDescription}</p>
                  </div>
                </div>

                {/* Icon */}
                <div className="absolute left-1/2 -translate-x-1/2">
                  <div
                    className={`w-14 h-14 rounded-2xl bg-gradient-to-r ${step.gradient} p-[1px]`}
                  >
                    <div className="w-full h-full rounded-2xl bg-black flex items-center justify-center">
                      <step.icon className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile View */}
        <div className="block lg:hidden relative space-y-10">
          {steps.map((step, index) => {
            if (index >= 3 && !showAllMobile) return null;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {/* Expandable Card */}
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                  className="relative rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 p-6 cursor-pointer mt-4"
                >
                  <div
                    className={`mb-2 w-fit text-[10px] font-bold text-white bg-gradient-to-r ${step.gradient} px-2 py-0.5 rounded-full shadow-lg`}
                  >
                    {step.step}
                  </div>
                  <h3
                    className={`text-lg font-bold mb-3 bg-gradient-to-r ${step.gradient} bg-clip-text text-transparent`}
                  >
                    {step.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {expandedIndex === index ? step.fullDescription : step.shortDescription}
                  </p>
                  <div className="flex justify-center mt-4 text-sm font-medium bg-gradient-to-r bg-clip-text text-transparent from-blue-400 to-purple-400">
                    {expandedIndex === index ? 'See Less' : 'See More'}
                    <ChevronDown
                      className={`w-4 h-4 ml-2 transition-transform ${
                        expandedIndex === index ? 'rotate-180' : ''
                      }`}
                    />
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
          {!showAllMobile && (
            <div className="flex justify-center">
              <button
                onClick={() => setShowAllMobile(true)}
                className="rounded-xl w-full border bg-gray-900/30 border-gray-800/50 hover:border-gray-700/50 px-5 py-3 text-sm font-semibold text-white/80 transition-all duration-300 hover:text-white"
              >
                See more steps
              </button>
            </div>
          )}
          {showAllMobile && (
            <div className="flex justify-center">
              <button
                onClick={() => setShowAllMobile(false)}
                className="rounded-xl w-full border bg-gray-900/30 border-gray-800/50 hover:border-gray-700/50 px-5 py-3 text-sm font-semibold text-white/80 transition-all duration-300 hover:text-white"
              >
                See fewer steps
              </button>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
};

export default memo(Process);
