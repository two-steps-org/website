import React, { useCallback, useEffect, useState } from 'react';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { AINetworkVisualization } from './ui/AINetworkVisualization';
import Section from './common/Section';
import AnimatedGradientText from './common/AnimatedGradientText';
import ErrorBoundary from './common/ErrorBoundary';
import { useDeviceType } from '../utils/responsive/hooks/useDeviceType';

const Hero: React.FC = () => {
  const deviceType = useDeviceType();
  const isMobile = deviceType === 'mobile';
  const [showMobileVisualization, setShowMobileVisualization] = useState(!isMobile);

  useEffect(() => {
    if (!isMobile) {
      setShowMobileVisualization(true);
      return;
    }

    const REVEAL_SCROLL_Y = 120;
    const revealOnScroll = () => {
      setShowMobileVisualization(window.scrollY > REVEAL_SCROLL_Y);
    };

    revealOnScroll();
    window.addEventListener('scroll', revealOnScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', revealOnScroll);
    };
  }, [isMobile]);

  const handleBookCall = useCallback(() => {
    window.open('https://calendly.com/yoni-insell-twosteps/30min', '_blank');
  }, []);

  return (
    <Section className="relative overflow-hidden min-h-0 lg:min-h-[calc(100vh-80px)] flex items-center justify-center pt-36 pb-12 md:py-28 lg:py-0">
      <div className="grid lg:grid-cols-[1fr,1.1fr] items-center gap-8 lg:gap-8 w-full max-w-7xl mx-auto">
        {/* Left Column */}
        <div className="z-10 space-y-6 text-center lg:text-left flex flex-col justify-center h-full">
          {/* Headline */}
          <h1 className="text-[clamp(2.5rem,6vw,4rem)] font-bold tracking-tight leading-[1.05]">
            <AnimatedGradientText
              gradient="from-purple-400 via-blue-400 to-cyan-400"
              className="bg-[length:300%_auto]"
              duration={4}
            >
              Always Be Ahead
            </AnimatedGradientText>
            <div className="h-1 lg:h-2" />
            <span className="text-white block">AI Built Just For You</span>
          </h1>

          {/* Description */}
          <p className="text-gray-400 text-base sm:text-lg lg:text-xl leading-relaxed max-w-2xl mx-auto lg:mx-0">
            At Two Steps, our process is simple:{' '}
            <span className="font-semibold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              You Bring The Vision,
            </span>
            {' '}we bring it to life.
            <br className="hidden lg:block" />
            We craft custom AI solutions, turning complex challenges into seamless automation.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start w-full sm:w-auto">
            <button
              onClick={handleBookCall}
              className="relative group min-h-[56px] px-8 rounded-xl font-bold overflow-hidden shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 active:scale-95 transition-all duration-300 text-lg w-full sm:w-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:from-blue-500 group-hover:to-purple-500 transition-colors" />
              <span className="relative flex items-center justify-center gap-2 text-white">
                Book a Call
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </button>

            <Link to="/case-studies" className="w-full sm:w-auto">
              <button className="w-full px-8 min-h-[56px] rounded-xl font-bold border border-white/10 text-white hover:border-blue-500/50 hover:bg-blue-500/5 active:scale-95 transition-all duration-300 backdrop-blur-sm">
                Case Studies
              </button>
            </Link>
          </div>
        </div>

        {/* Right Column - AI Network Visualization */}
        <div className={`relative w-full h-[320px] sm:h-[400px] md:h-[500px] lg:h-[600px] mt-4 lg:mt-0 flex items-center justify-center select-none ${isMobile && !showMobileVisualization ? 'opacity-0 pointer-events-none' : ''}`}>
          <div className="w-full h-full relative flex items-center justify-center p-4 sm:p-0">
            {(!isMobile || showMobileVisualization) && (
              <ErrorBoundary
                fallback={
                  <div className="w-full h-full flex items-center justify-center bg-blue-500/5 rounded-3xl border border-blue-500/10">
                    <p className="text-gray-500">Visualization unavailable</p>
                  </div>
                }
              >
                <AINetworkVisualization simplified={isMobile} />
              </ErrorBoundary>
            )}
          </div>
        </div>
      </div>
    </Section>
  );
};

export default React.memo(Hero);
