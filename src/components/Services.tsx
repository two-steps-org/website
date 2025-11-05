import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageSquareText,
  Mic,
  LayoutDashboard,
  Code2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Section from './common/Section';
import ServiceModal from './ServiceModal';
import BackgroundGradient from './common/BackgroundGradient';

const services = [
  {
    icon: MessageSquareText,
    title: 'AI Chat Agents',
    description:
      'Transform how you engage with customers and streamline operations using smart AI Chat Agents built just for you.',
    gradient: 'from-amber-500 to-orange-500',
    delay: 0,
    details: {
      features: [
        'Text-based conversational agents',
        'Task automation and workflow integration',
        '24/7 availability',
        'Personalized responses and functionality',
      ],
      benefits: [
        'Enhance customer engagement',
        'Automate repetitive tasks',
        'Improve response times and accuracy',
        'Free up your team for higher-value activities',
      ],
      useCase:
        'Businesses aiming to automate customer service, streamline operations, and ensure personalized interactions with clients and team members.',
    },
  },
  {
    icon: Mic,
    title: 'AI Voice Agents',
    description:
      'Enhance customer experiences with conversational AI Voice Agents that handle calls like a pro.',
    gradient: 'from-blue-500 to-indigo-500',
    delay: 0.1,
    featured: true,
    details: {
      features: [
        'Multilingual voice assistants',
        'Natural language processing',
        'Integration with phones and apps',
        'Real-time task execution',
      ],
      benefits: [
        'Enhance customer experience',
        'Reduce manual call handling',
        'Ensure 24/7 availability',
        'Support multiple languages',
      ],
      useCase:
        'For industries needing real-time, voice-based support—deploy a single agent or a coordinated team to suit your needs.',
    },
  },
  {
    icon: LayoutDashboard,
    title: 'CRM Development',
    description:
      'Say goodbye to generic CRMs — let us build one perfectly designed for your needs.',
    gradient: 'from-purple-500 to-pink-500',
    delay: 0.2,
    details: {
      features: [
        'Fully customizable CRM platforms',
        'Built-in automation',
        'Seamless integration',
        'Scalable solutions',
      ],
      benefits: [
        'Streamline workflows',
        'Improve team collaboration',
        'Save on costs',
        'Scale effortlessly',
      ],
      useCase:
        'Organizations seeking a CRM designed for their specific needs, eliminating unnecessary features and boosting productivity.',
    },
  },
  {
    icon: Code2,
    title: 'Custom SaaS Solutions',
    description:
      'Bring your vision to life with custom-built software, tailored precisely to your needs.',
    gradient: 'from-green-500 to-emerald-500',
    delay: 0.3,
    details: {
      features: [
        'Custom software solutions',
        'Robust architecture',
        'API integration',
        'Unique requirements',
      ],
      benefits: [
        'Build unique products',
        'Gain competitive edge',
        'Ensure seamless UX/UI',
        'Adapt as needed',
      ],
      useCase:
        'Businesses with unique software needs that require custom-built, scalable, and integrated SaaS solutions.',
    },
  },
];

const Service: React.FC = () => {
  const [selectedService, setSelectedService] = useState<any>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const handleBookCall = () => {
    window.open('https://calendly.com/yoniinsell/30min', '_blank');
  };

  // Carousel logic
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
    setCurrentIndex((prevIndex) => (prevIndex + newDirection + services.length) % services.length);
  };

  return (
    <BackgroundGradient>
      <Section id="services" className="bg-black py-16">
        <div className="relative">
          {/* Section Title */}
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-12 lg:mb-24">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className="text-blue-400 text-sm font-semibold tracking-wider uppercase mb-3 block"
            >
              OUR SERVICES
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="text-3xl md:text-5xl font-bold"
            >
              <span className="bg-gradient-to-r from-white to-gray-500 bg-clip-text text-transparent">
                Automate Roles, Not Just Tasks
              </span>
            </motion.h2>
          </div>

          {/* Desktop Grid */}
          <div className="hidden lg:grid grid-cols-1 lg:grid-cols-4 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: service.delay }}
                className={`group relative ${service.featured ? 'lg:-mt-16 z-10' : ''}`}
              >
                <div
                  className={
                    service.featured
                      ? `relative h-full rounded-2xl overflow-hidden backdrop-blur-xl p-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-lg shadow-blue-500/20`
                      : `relative h-full overflow-hidden rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 hover:border-blue-500/30 transition-all duration-300`
                  }
                >
                  <div
                    className={
                      service.featured ? 'h-full rounded-2xl bg-[#0A0F1F]/95 p-8' : 'h-full p-8'
                    }
                  >
                    {/* Icon */}
                    <div className="mb-6">
                      <div
                        className={`w-12 h-12 rounded-xl bg-gradient-to-r ${service.gradient} p-[1px] group-hover:scale-110 transition-transform duration-300`}
                      >
                        <div className="w-full h-full rounded-xl bg-gray-900 flex items-center justify-center">
                          <service.icon className="w-5 h-5 text-white" />
                        </div>
                      </div>
                    </div>

                    <h3
                      className={`text-xl font-bold mb-4 bg-gradient-to-r ${service.gradient} bg-clip-text text-transparent`}
                    >
                      {service.title}
                    </h3>

                    <p className="text-gray-400 mb-8 leading-relaxed">{service.description}</p>

                    <button
                      onClick={() => setSelectedService(service)}
                      className="flex items-center text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors group/btn"
                    >
                      See More
                      <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover/btn:opacity-100 transform -translate-x-2 group-hover/btn:translate-x-0 transition-all duration-300" />
                    </button>

                    {service.featured && (
                      <div className="absolute top-4 right-4">
                        <div className="px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-purple-500/25">
                          Popular
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div
                  className={`absolute -inset-2 bg-gradient-to-r ${service.gradient} rounded-3xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 -z-10`}
                />
                {service.featured && (
                  <div className="absolute -inset-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl opacity-5 blur-2xl -z-20" />
                )}
              </motion.div>
            ))}
          </div>

          {/* Mobile Carousel */}
          <div className="block lg:hidden relative min-h-[280px] overflow-hidden px-2">
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
                className="absolute w-[98%]"
              >
                <motion.div
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedService(services[currentIndex])}
                  className="relative h-[220px] overflow-hidden rounded-2xl bg-gray-900/50 backdrop-blur-xl border border-gray-800/50 p-4 group hover:border-blue-500/30 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div
                      className={`w-10 h-10 rounded-xl bg-gradient-to-r ${services[currentIndex].gradient} p-[1px] flex-shrink-0`}
                    >
                      <div className="w-full h-full rounded-xl bg-gray-900 flex items-center justify-center">
                        {React.createElement(services[currentIndex].icon, {
                          className: 'w-5 h-5 text-white',
                        })}
                      </div>
                    </div>

                    <h3
                      className={`text-lg font-bold bg-gradient-to-r ${services[currentIndex].gradient} bg-clip-text text-transparent`}
                    >
                      {services[currentIndex].title}
                    </h3>
                  </div>

                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    {services[currentIndex].description}
                  </p>

                  <div className="absolute bottom-5 left-0 right-0 flex justify-center">
                    <button
                      className={`relative flex items-center text-sm font-medium bg-gradient-to-r ${services[currentIndex].gradient} bg-clip-text text-transparent hover:opacity-80`}
                    >
                      Learn More
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                  <div
                    className={`absolute -inset-2 bg-gradient-to-r ${services[currentIndex].gradient} rounded-3xl opacity-0 group-hover:opacity-10 blur-xl transition-opacity duration-500 -z-10`}
                  />
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="absolute inset-x-0 bottom-0 flex justify-center items-center">
              <div className="flex items-center gap-3 mb-2">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => paginate(-1)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-400" />
                </motion.button>

                <div className="flex space-x-2">
                  {services.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setDirection(idx > currentIndex ? 1 : -1);
                        setCurrentIndex(idx);
                      }}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        idx === currentIndex
                          ? `bg-gradient-to-r ${services[currentIndex].gradient}`
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
        </div>

        {/* Service Details Modal */}
        <ServiceModal
          isOpen={!!selectedService}
          onClose={() => setSelectedService(null)}
          service={selectedService}
          onBookCall={handleBookCall}
        />
      </Section>
    </BackgroundGradient>
  );
};

export default Service;
