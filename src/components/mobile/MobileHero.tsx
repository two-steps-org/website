import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import AnimatedGradientText from '../common/AnimatedGradientText';

const MobileHero: React.FC = () => {
  const handleBookCall = () => {
    window.open('https://calendly.com/yoniinsell/30min', '_blank');
  };

  return (
    <section className="relative min-h-[100dvh] flex flex-col justify-center px-4 xs:px-5 sm:px-6 pt-28 xs:pt-32 sm:pt-36 pb-8 xs:pb-10 sm:pb-12 overflow-hidden touch-manipulation">
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[200vw] aspect-square 
          bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-blue-500/10 
          rounded-full blur-[100px] animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite]" 
        />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-[200vw] aspect-square 
          bg-gradient-to-br from-purple-500/10 via-blue-500/10 to-purple-500/10 
          rounded-full blur-[100px] animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite]"
          style={{ animationDelay: '2s' }}
        />
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-[0.02] bg-[length:24px_24px]" />
        
        {/* Subtle Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20" />
      </div>

      <div className="relative text-center max-w-[540px] mx-auto">
        {/* Tag Line */}
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-block text-blue-400 text-[12px] xs:text-[13px] sm:text-[14px] font-semibold tracking-[0.1em] uppercase mb-3 xs:mb-4 sm:mb-5 whitespace-nowrap"
        >
          AI Solutions Tailored for Your Business
        </motion.span>

        {/* Main Heading */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-[28px] xs:text-[32px] sm:text-[36px] font-bold mb-4 xs:mb-5 sm:mb-6 leading-[1.15] tracking-[-0.03em]"
        >
          <AnimatedGradientText
            gradient="from-purple-400 via-blue-400 to-cyan-400"
            className="bg-[length:300%_auto]"
          >
            Always Be Ahead
          </AnimatedGradientText>
          <br className="block h-2" />
          <span className="text-white">AI Built Just For You</span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-400 text-[15px] xs:text-[16px] sm:text-[18px] mb-8 xs:mb-10 sm:mb-12 leading-[1.8] max-w-[440px] xs:max-w-[460px] sm:max-w-[480px] mx-auto"
        >
          At Two Steps, our process is simple:
          <br className="block h-1" />
          <span className="font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent block">
            You Bring The Vision, We Bring It To Life.
          </span>
          <br className="block h-1" />
          We craft custom AI solutions, turning complex challenges into seamless automation.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col xs:flex-row items-stretch justify-center gap-3 xs:gap-4 max-w-[400px] mx-auto"
        >
          {/* Book Call Button */}
          <motion.button
            onClick={handleBookCall}
            whileTap={{ scale: 0.98 }}
            className="w-full xs:flex-1 h-[52px] bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl font-medium flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/25 active:shadow-none transition-all duration-300 touch-manipulation"
          >
            Book a Call
            <ArrowRight className="w-5 h-5" />
          </motion.button>

          {/* Case Studies Button */}
          <Link to="/case-studies" className="w-full xs:flex-1">
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="w-full h-[52px] rounded-xl font-medium border border-gray-700 text-white hover:border-blue-400 hover:bg-blue-500/10 active:bg-blue-500/5 transition-all duration-300 backdrop-blur-sm touch-manipulation"
            >
              Case Studies
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default MobileHero;