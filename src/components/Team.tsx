import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Linkedin, Instagram, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import Section from './common/Section';

const team = [
  {
    name: 'Jonathan Insell',
    role: 'CEO & Founder',
    image: '/Yoni.jpg',
    gradient: 'from-blue-500 to-indigo-500',
    social: {
      linkedin: 'https://www.linkedin.com/in/jonathan-charles-insell/',
      instagram: 'https://www.instagram.com/twostepsai/',
    },
  },
  {
    name: 'Shay Bushary',
    role: 'Head Developer',
    image: '/Shay.jpeg',
    gradient: 'from-purple-500 to-pink-500',
    social: {
      linkedin: 'https://www.linkedin.com/in/shaybushary/',
      instagram: 'https://www.instagram.com/twostepsai/',
    },
  },
  {
    name: 'Ziv Edri',
    role: 'CFO',
    image: '/Ziv.jpeg',
    gradient: 'from-amber-500 to-orange-500',
    social: {
      linkedin: 'https://www.linkedin.com/in/ziv-edri/',
      instagram: 'https://www.instagram.com/twostepsai/',
    },
  },
  {
    name: 'Tal Sumroy',
    role: 'Head of Marketing',
    image: '/Tal.jpeg',
    gradient: 'from-green-500 to-emerald-500',
    social: {
      linkedin: 'https://www.linkedin.com/in/tal-sumroy/',
      instagram: 'https://www.instagram.com/twostepsai/',
    },
  },
];

const Team: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => Math.abs(offset) * velocity;

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => (prev + newDirection + team.length) % team.length);
  };

  return (
    <Section id="team" className="relative pb-14">
      {/* Header */}
      <div className="relative text-center mb-12 sm:mb-16">
        <div className="inline-flex mb-4 px-4 sm:px-5 py-2.5 bg-gradient-to-r from-blue-500/10 via-blue-500/5 to-transparent rounded-full backdrop-blur-sm border border-blue-500/10 shadow-[0_0_20px_rgba(59,130,246,0.1)] hover:border-blue-500/20 hover:shadow-[0_0_25px_rgba(59,130,246,0.15)] transition-all duration-300 mx-auto lg:mx-0">
          <span className="text-blue-400 text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2">
            <Users className="w-4 h-4 animate-[pulse_2s_ease-in-out_infinite]" />
            The Team
          </span>
        </div>
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6"
        >
          <span className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
            We Are Ready To Provide Solutions
          </span>
        </motion.h2>
      </div>

      {/* Desktop Grid */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
        {team.map((member, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
            className="group relative"
          >
            <div className="relative bg-gray-900/50 backdrop-blur-xl rounded-2xl overflow-hidden">
              <div className="relative h-[350px] overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 brightness-90 group-hover:brightness-100 group-hover:contrast-125"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent" />
              </div>
              <div className="relative p-6 -mt-16">
                <h3 className="text-2xl font-bold text-white mb-2 mt-4">{member.name}</h3>
                <p
                  className={`text-transparent bg-clip-text bg-gradient-to-r ${member.gradient} font-medium mb-4`}
                >
                  {member.role}
                </p>
                <div className="flex space-x-3">
                  <motion.a
                    href={member.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -2 }}
                    className={`p-2 rounded-xl bg-gradient-to-r ${member.gradient} bg-opacity-50 hover:bg-opacity-75 transition-all`}
                  >
                    <Linkedin className="w-5 h-5 text-white" />
                  </motion.a>
                  <motion.a
                    href={member.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ y: -2 }}
                    className={`p-2 rounded-xl bg-gradient-to-r ${member.gradient} bg-opacity-50 hover:bg-opacity-75 transition-all`}
                  >
                    <Instagram className="w-5 h-5 text-white" />
                  </motion.a>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mobile Carousel */}
      <div className="block md:hidden relative min-h-[520px] overflow-visible">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(_, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute inset-0 px-1"
          >
            <motion.div
              whileTap={{ scale: 0.98 }}
              className="relative w-full h-fit overflow-hidden rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 group hover:border-blue-500/30 transition-all duration-300 pb-4"
            >
              <div className="relative w-full h-[350px] mb-5 rounded-xl overflow-hidden">
                <img
                  src={team[currentIndex].image}
                  alt={team[currentIndex].name}
                  className="w-full h-fit object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
              </div>

              <h3 className="text-xl font-bold text-white mb-1 px-4">{team[currentIndex].name}</h3>
              <p
                className={`px-4 text-sm font-semibold bg-gradient-to-r ${team[currentIndex].gradient} bg-clip-text text-transparent mb-5`}
              >
                {team[currentIndex].role}
              </p>

              <div className="flex space-x-3 px-4">
                <motion.a
                  href={team[currentIndex].social.linkedin}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2 rounded-lg bg-gradient-to-r ${team[currentIndex].gradient} bg-opacity-50 hover:bg-opacity-75 transition-all`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="w-4 h-4 text-white" />
                </motion.a>
                <motion.a
                  href={team[currentIndex].social.instagram}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2 rounded-lg bg-gradient-to-r ${team[currentIndex].gradient} bg-opacity-50 hover:bg-opacity-75 transition-all`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="w-4 h-4 text-white" />
                </motion.a>
              </div>

              <div
                className={`absolute -inset-2 bg-gradient-to-r ${team[currentIndex].gradient} rounded-3xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 -z-10`}
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Controls */}
        <div className="absolute inset-x-0 bottom-[-30px] flex justify-center items-center z-10">
          <div className="flex items-center gap-3 mb-2">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => paginate(-1)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </motion.button>

            <div className="flex space-x-2">
              {team.map((member, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > currentIndex ? 1 : -1);
                    setCurrentIndex(idx);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    idx === currentIndex ? `bg-gradient-to-r ${member.gradient}` : 'bg-gray-600'
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
    </Section>
  );
};

export default Team;
