import React, { useCallback, Suspense, useState, useEffect } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { SplineScene } from './ui/splite';
import Section from './common/Section';
import AnimatedGradientText from './common/AnimatedGradientText';
import { isMobileDevice } from '../utils/responsive/device';

// Lazy load framer-motion only on desktop
const MotionComponents = React.lazy(() =>
  isMobileDevice()
    ? Promise.resolve({ default: { div: 'div', button: 'button' } })
    : import('framer-motion').then((mod) => ({
        default: { div: mod.motion.div, button: mod.motion.button },
      }))
);

const Hero: React.FC = () => {
  const [isMobile, setIsMobile] = useState(true);
  const handleBookCall = useCallback(() => {
    window.open('https://calendly.com/yoni-insell-twosteps/30min', '_blank');
  }, []);

  useEffect(() => {
    setIsMobile(isMobileDevice());
  }, []);

  return (
    <Section className="relative flex flex-col justify-center overflow-hidden pt-20 pb-14 sm:pt-24 lg:pt-28 lg:pb-20 md:min-h-[calc(100vh-72px)]">
      <div className="relative w-full px-4 sm:px-6 lg:px-8 mx-auto grid lg:grid-cols-2 items-center gap-10 lg:gap-12">
        {/* Left Column */}
        <div className="z-10 space-y-6 sm:space-y-8 text-center lg:text-left animate-fade-in">
          {/* Tagline */}
          <div className="inline-flex px-4 sm:px-5 py-2 bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent rounded-full backdrop-blur-sm border border-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:border-blue-500/20 hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] transition-all duration-300 mx-auto lg:mx-0">
            <span className="text-blue-400 text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2">
              <Sparkles className="w-4 h-4 animate-[pulse_2s_ease-in-out_infinite]" />
              AI Solutions Tailored for Your Business
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-[clamp(2rem,7vw,2.4rem)] text-[1.2rem] sm:text-[1.8rem] lg:text-[3rem] xl:text-[3.5rem] font-bold tracking-tight leading-[1.1]">
            <AnimatedGradientText
              gradient="from-purple-400 via-blue-400 to-cyan-400"
              className="bg-[length:300%_auto]"
              duration={4}
            >
              Always Be Ahead
            </AnimatedGradientText>
            <div className="h-2 sm:h-2.5 lg:h-3" />
            <span className="text-white">AI Built Just For You</span>
          </h1>

          {/* Description */}
          <p className="text-gray-400 text-[15px] text-xs sm:text-sm lg:text-lg leading-[1.75] tracking-[-0.01em] max-w-xl mx-auto lg:mx-0">
            At Two Steps, our process is simple:{' '}
            <span className="font-semibold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              You Bring The Vision,
            </span>
            <br />
            <span className="font-semibold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
              We Bring It To Life.
            </span>
            <br />
            We craft custom AI solutions, turning complex challenges into seamless automation.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col lg:flex-col md:flex-wrap md:flex-row gap-4 pt-4 justify-center lg:justify-start w-full">
            <button
              onClick={handleBookCall}
              className="w-auto relative min-h-[52px] sm:min-h-[56px] px-6 sm:px-7 lg:px-8 py-3 lg:py-3.5 rounded-xl font-semibold overflow-hidden shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 active:scale-95 transition-all duration-300 text-base sm:text-lg flex items-center justify-center gap-2"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500" />
              <span className="relative flex items-center justify-center gap-2 text-white">
                Book a Call
                <ArrowRight className="w-5 h-5 transition-transform duration-300 ease-out group-hover:translate-x-1" />
              </span>
            </button>

            <Link to="/case-studies" className="w-auto">
              <button className="w-full px-4 min-h-[52px] h-full rounded-xl font-medium border border-gray-700 text-white hover:border-blue-400 hover:bg-blue-500/10 active:bg-blue-500/5 active:scale-95 transition-all duration-300 backdrop-blur-sm">
                Case Studies
              </button>
            </Link>
          </div>
        </div>

        {/* Right Column - Only on desktop, no Spline on mobile */}
        {!isMobile && (
          <div className="relative w-full h-[min(75vh,780px)] hidden lg:inline-block animate-fade-in">
            <div className="w-full h-full rounded-xl overflow-hidden">
              <Suspense
                fallback={
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                }
              >
                <SplineScene
                  scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
                  className="w-full h-full scale-105"
                  loading="lazy"
                  quality="low"
                />
              </Suspense>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
};

export default React.memo(Hero);
