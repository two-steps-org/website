import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import ParticleBackground from '../../../components/ParticleBackground';

/**
 * Hero section displayed at the top of the Case Studies page.
 * Includes animated background effects and a call to action button.
 */
const CaseStudiesHero: React.FC = () => {
  const handleBookCall = () => {
    window.open('https://calendly.com/yoniinsell/30min', '_blank');
  };

  return (
    <section className="relative overflow-hidden py-24 md:py-36 text-center">
      {/* Background effects */}
      <div className="absolute inset-0">
        <ParticleBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-black" />
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.04]" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-blue-400 text-sm font-semibold tracking-wider uppercase mb-3 block"
        >
          Case Studies
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-4xl sm:text-5xl font-bold mb-6"
        >
          <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Real Results With AI
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-gray-400 text-lg mb-8"
        >
          Explore how businesses have leveraged our solutions to automate work and grow faster.
        </motion.p>
        <motion.button
          whileTap={{ scale: 0.98 }}
          onClick={handleBookCall}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl px-6 py-3 font-medium hover:shadow-lg transition-all"
        >
          Book a Call
          <ArrowRight className="w-5 h-5" />
        </motion.button>
      </div>
    </section>
  );
};

export default CaseStudiesHero;
