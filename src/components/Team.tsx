import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Linkedin, Instagram, ChevronLeft, ChevronRight } from 'lucide-react';
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
    center: { x: 0, opacity: 1, zIndex: 1 },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      zIndex: 0,
    }),
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prev) => (prev + newDirection + team.length) % team.length);
  };

  return (
    <Section id="team" className="relative">
      {/* Background Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />

      {/* Header */}
      <div className="relative text-center mb-12 sm:mb-16">
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
      <div className="block md:hidden relative h-[420px] overflow-hidden">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ x: { type: 'spring', stiffness: 300, damping: 30 } }}
            className="absolute w-full"
          >
            <div className="w-full px-4">
              <div className="relative overflow-hidden rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800/50">
                <div className="relative h-64">
                  <img
                    src={team[currentIndex].image}
                    alt={team[currentIndex].name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
                </div>
                <div className="relative p-6 -mt-12">
                  <h3 className="text-xl font-bold text-white mb-1">{team[currentIndex].name}</h3>
                  <p
                    className={`text-sm font-medium bg-gradient-to-r ${team[currentIndex].gradient} bg-clip-text text-transparent mb-4`}
                  >
                    {team[currentIndex].role}
                  </p>
                  <div className="flex space-x-3">
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
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Mobile Controls */}
        <div className="absolute inset-x-0 bottom-0 flex justify-center items-center px-4 py-4">
          <div className="flex items-center gap-4">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => paginate(-1)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10"
            >
              <ChevronLeft className="w-5 h-5 text-gray-400" />
            </motion.button>

            {/* Dots */}
            <div className="flex space-x-2">
              {team.map((_, i) => (
                <button
                  key={i}
                  onClick={() => {
                    setDirection(i > currentIndex ? 1 : -1);
                    setCurrentIndex(i);
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentIndex
                      ? `bg-gradient-to-r ${team[currentIndex].gradient}`
                      : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => paginate(1)}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10"
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
