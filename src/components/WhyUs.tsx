import React from 'react';
import { motion } from 'framer-motion';
import { Target, Puzzle, Brain, Rocket, ShieldCheck, HeartHandshake } from 'lucide-react';
import Section from './common/Section';
import BackgroundGradient from './common/BackgroundGradient';

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
  return (
    <BackgroundGradient>
      <Section id="why-us" className="bg-black py-16 md:py-24 relative">
        {/* Heading */}
        <div className="relative text-center mb-12 md:mb-16">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3 }}
            className="text-blue-400 text-xs md:text-sm font-semibold tracking-wider uppercase mb-3 block"
          >
            UNIQUE VALUE
          </motion.span>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
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
      </Section>
    </BackgroundGradient>
  );
};

export default WhyUs;
