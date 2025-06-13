import React, { useEffect, useRef, useCallback, Suspense } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { SplineScene } from "./ui/splite";
import Section from "./common/Section";
import AnimatedGradientText from "./common/AnimatedGradientText";
import { useIntersectionObserver } from "../utils/performance/hooks";

/**
 * Hero
 *
 * Layout:
 * - Left column: Headings, text, CTA buttons
 * - Right column: Larger Robot (SplineScene), shifted slightly higher
 *
 * Enhancements:
 * - Robot occupies more vertical space AND is moved up a bit to fit better in the hero.
 */
const Hero: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [setIntersectionRef, isVisible] = useIntersectionObserver({
    threshold: 0.1,
  });

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Spring configuration for smooth 3D tilt
  const springConfig = { damping: 30, stiffness: 250, mass: 1 };
  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], [5, -5]),
    springConfig
  );
  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], [-5, 5]),
    springConfig
  );

  useEffect(() => {
    if (heroRef.current) {
      setIntersectionRef(heroRef.current);
    }
  }, [setIntersectionRef]);

  // Handle mouse movement for 3D rotation on the robot
  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      mouseX.set(x);
      mouseY.set(y);
    },
    [mouseX, mouseY]
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const handleBookCall = useCallback(() => {
    window.open("https://calendly.com/yoniinsell/30min", "_blank");
  }, []);

  return (
    <Section
      ref={heroRef}
      className="relative min-h-screen flex flex-col justify-center py-32 overflow-hidden"
    >
      {/* ======= Background Layers (same as original) ======= */}
      <div className="fixed inset-0 -z-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.15),transparent_100%)]"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0 bg-gradient-to-tr from-purple-500/[0.05] via-transparent to-blue-500/[0.05]"
        />
        <div className="absolute top-0 left-1/4 w-[1000px] h-[1000px] bg-blue-500/10 rounded-full opacity-5 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-[1000px] h-[1000px] bg-purple-500/10 rounded-full opacity-5 blur-[100px]" />
      </div>

      <div className="relative max-w-7xl w-full px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="grid lg:grid-cols-2 items-center gap-8">
          {/* ======= Left Column: Text & CTA ======= */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="z-10 space-y-6 sm:space-y-7 lg:space-y-8 max-w-[640px]"
          >
            {/* Subtle label / tagline */}
            <div
              className="group inline-flex px-4 sm:px-5 py-2 
              bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent
              rounded-full backdrop-blur-sm border border-blue-500/10
              shadow-[0_0_20px_rgba(59,130,246,0.1)]
              hover:border-blue-500/20 hover:shadow-[0_0_25px_rgba(59,130,246,0.15)]
              transition-all duration-300"
            >
              <span className="text-blue-400 text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2">
                <Sparkles className="w-4 h-4 animate-[pulse_2s_ease-in-out_infinite]" />
                AI Solutions Tailored for Your Business
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-[2.2rem] sm:text-[2.7rem] lg:text-[3rem] xl:text-[3.5rem] font-bold tracking-tight leading-[1.1]">
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

            {/* Subtext */}
            <p className="text-gray-400 text-[15px] sm:text-base lg:text-lg leading-[1.8] tracking-[-0.01em]">
              At Two Steps, our process is simple:{" "}
              <span className="font-semibold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                You Bring The Vision,
              </span>
              <br />
              <span className="font-semibold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                We Bring It To Life.
              </span>
              <br />
              We craft custom AI solutions, turning complex challenges into
              seamless automation.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-3">
              <motion.button
                onClick={handleBookCall}
                whileHover={{ scale: 1.03, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="group relative min-h-[52px] sm:min-h-[56px]
                  px-6 sm:px-7 lg:px-8 py-3 lg:py-3.5 
                  rounded-lg lg:rounded-xl font-semibold overflow-hidden 
                  shadow-lg shadow-blue-500/25 
                  hover:shadow-xl hover:shadow-blue-500/30
                  transition-all duration-300 
                  text-base sm:text-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500" />
                <span className="relative flex items-center justify-center gap-2 text-white">
                  Book a Call
                  <ArrowRight className="w-5 h-5 transition-transform duration-300 ease-out group-hover:translate-x-1" />
                </span>
              </motion.button>

              <Link to="/case-studies">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative min-h-[52px] sm:min-h-[56px]
                    px-6 sm:px-7 lg:px-8 py-3 lg:py-3.5 
                    rounded-lg lg:rounded-xl font-semibold border border-gray-800
                    text-base sm:text-lg text-white backdrop-blur-sm
                    hover:bg-gradient-to-r hover:from-blue-500/10 hover:to-purple-500/10 
                    hover:border-blue-500/50
                    transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10
                    flex items-center justify-center"
                >
                  Case Studies
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* ======= Right Column: Bigger Robot (Spline Scene), Shifted Up ======= */}
          <motion.div
            className="relative w-full h-[min(75vh,780px)] -mt-8"
            //  ↑ -mt-8 moves the robot ~2rem up to fit better
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          >
            <motion.div
              style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
              className="w-full h-full rounded-xl overflow-hidden"
            >
              {/* Adjusted scale for an even bigger robot */}
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
                  loading="eager"
                  quality="low"
                />
              </Suspense>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </Section>
  );
};

export default Hero;
