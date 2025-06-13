import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Linkedin, Instagram, ChevronLeft, ChevronRight } from 'lucide-react';
import SectionBackground from '../common/SectionBackground';

const team = [
  {
    name: "Jonathan Insell",
    role: "CEO & Founder", 
    image: "/Yoni.jpg",
    gradient: "from-blue-500 to-indigo-500",
    social: {
      linkedin: "https://www.linkedin.com/in/jonathan-charles-insell/",
      instagram: "#"
    }
  },
  {
    name: "Shay Bushary",
    role: "Head Developer",
    image: "/Shay.jpeg",
    gradient: "from-purple-500 to-pink-500",
    social: {
      linkedin: "#",
      instagram: "#"
    }
  },
  {
    name: "Ziv Edri",
    role: "CFO",
    image: "/Ziv.jpeg",
    gradient: "from-amber-500 to-orange-500",
    social: {
      linkedin: "#",
      instagram: "#"
    }
  },
  {
    name: "Tal Sumroy",
    role: "Head of AI",
    image: "/Tal.jpeg",
    gradient: "from-green-500 to-emerald-500",
    social: {
      linkedin: "#",
      instagram: "#"
    }
  }
];

const MobileTeam = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset, velocity) => {
    return Math.abs(offset) * velocity;
  };

  const paginate = (newDirection) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => (
      (prevIndex + newDirection + team.length) % team.length
    ));
  };

  return (
    <SectionBackground
      id="team"
      className="py-16 px-4"
      gradient="from-blue-500/10 via-cyan-500/10 to-blue-500/10"
    >
      <div className="text-center mb-8">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-blue-400 text-sm font-semibold tracking-wider uppercase mb-4 block"
        >
          THE TEAM
        </motion.span>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-2xl font-bold mb-4"
        >
          <span className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            We Are Ready To Provide Solutions
          </span>
        </motion.h2>
      </div>

      <div className="relative h-[420px] overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);

              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute w-full"
          >
            <div className="w-full px-4">
              <motion.div
                whileTap={{ scale: 0.98 }}
                className="relative overflow-hidden rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800/50"
              >
                {/* Image Container */}
                <div className="relative h-64">
                  {/* Image */}
                  <img
                    src={team[currentIndex].image}
                    alt={team[currentIndex].name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
                </div>

                {/* Content */}
                <div className="relative p-6 -mt-12">
                  <h3 className="text-xl font-bold text-white mb-1">
                    {team[currentIndex].name}
                  </h3>
                  <p className={`text-sm font-medium bg-gradient-to-r ${team[currentIndex].gradient} bg-clip-text text-transparent mb-4`}>
                    {team[currentIndex].role}
                  </p>

                  {/* Social Links */}
                  <div className="flex space-x-3">
                    <motion.a
                      href={team[currentIndex].social.linkedin}
                      whileTap={{ scale: 0.95 }}
                      className={`p-2 rounded-lg bg-gradient-to-r ${team[currentIndex].gradient} bg-opacity-50 hover:bg-opacity-75 transition-all duration-300`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Linkedin className="w-4 h-4 text-white" />
                    </motion.a>
                    <motion.a
                      href={team[currentIndex].social.instagram}
                      whileTap={{ scale: 0.95 }}
                      className={`p-2 rounded-lg bg-gradient-to-r ${team[currentIndex].gradient} bg-opacity-50 hover:bg-opacity-75 transition-all duration-300`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Instagram className="w-4 h-4 text-white" />
                    </motion.a>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        <div className="absolute inset-x-0 bottom-0 flex justify-center items-center px-4 py-4">
          <div className="flex items-center gap-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => paginate(-1)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </motion.button>

            {/* Dots */}
            <div className="flex space-x-2">
              {team.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setDirection(index > currentIndex ? 1 : -1);
                    setCurrentIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? `bg-gradient-to-r ${team[currentIndex].gradient}`
                      : 'bg-gray-600'
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
    </SectionBackground>
  );
};

export default MobileTeam;