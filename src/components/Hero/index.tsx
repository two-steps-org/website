import React, { memo } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * Hero section of the landing page, featuring animated gradient orbs,
 * a tagline, and CTA buttons for booking a call or viewing case studies.
 */
const Hero: React.FC = () => {
  // Open Calendly in a new tab
  const handleBookCall = () => {
    window.open('https://calendly.com/yoniinsell/30min', '_blank');
  };

  return (
    <section
      className={clsx(
        'relative min-h-screen flex flex-col justify-center py-16 md:py-20 overflow-hidden'
      )}
    >
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Primary Gradient Orb */}
        <div
          className={clsx(
            'absolute top-1/4 left-1/2 transform -translate-x-1/2',
            'w-full aspect-square bg-gradient-to-br',
            'from-blue-500/20 via-purple-500/20 to-blue-500/20',
            'rounded-full blur-3xl animate-pulse'
          )}
        />

        {/* Secondary Gradient Orb */}
        <div
          className={clsx(
            'absolute bottom-1/4 left-1/2 transform -translate-x-1/2',
            'w-full aspect-square bg-gradient-to-br',
            'from-purple-500/20 via-blue-500/20 to-purple-500/20',
            'rounded-full blur-3xl animate-pulse'
          )}
        />

        {/* Grid Overlay */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-5" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          {/* Tagline */}
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-blue-400 text-sm sm:text-base lg:text-lg font-semibold tracking-wider uppercase mb-3"
          >
            AI Solutions Tailored for You
          </motion.span>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 leading-tight tracking-tight"
          >
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
              Always Be Ahead
            </span>
            <br />
            <span className="text-white mt-1 block">AI Built Just For You</span>
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-400 text-base sm:text-lg lg:text-xl leading-relaxed mb-8 sm:mb-10"
          >
            At Two Steps, our process is simple:{' '}
            <span className="font-semibold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              You Bring The Vision, We Bring It To Life.
            </span>{' '}
            We craft custom AI solutions, turning complex challenges into seamless automation.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-stretch justify-center gap-3 max-w-lg mx-auto"
          >
            {/* Book Call Button */}
            <motion.button
              onClick={handleBookCall}
              whileTap={{ scale: 0.98 }}
              className="flex-1 h-14 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium text-lg flex items-center justify-center gap-3 hover:shadow-lg hover:shadow-purple-500/25 active:shadow-none transition-all duration-300"
            >
              Book a Call
              <ArrowRight className="w-5 h-5" />
            </motion.button>

            {/* Case Studies Button */}
            <Link to="/case-studies" className="flex-1">
              <motion.button
                whileTap={{ scale: 0.98 }}
                className="w-full h-14 rounded-xl font-medium text-lg border border-gray-700 text-white hover:border-blue-400 hover:bg-blue-500/10 active:bg-blue-500/5 transition-all duration-300 backdrop-blur-sm"
              >
                Case Studies
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default memo(Hero);
